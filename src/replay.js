import PlayerSide from "./player_side.js";
import Scene from "./scene.js";
import ShowMulliganCards from "./actions/show_mulligan_cards.js";
import ReplaceMulliganCards from "./actions/replace_mulligan_cards.js";
import DrawCard from "./actions/draw_card.js";
import SetupCardsForAttackAction from "./actions/setup_cards_for_attack.js";
import PlayCardToBench from "./actions/play_card_to_bench.js";
import AnimationEffect from "./animation/animation_effect.js";
import CardData from "./card_data.js";
import ResolveFight from "./actions/resolve_fight.js";
import KillUnitAction from "./actions/kill_unit.js";

export default class Replay {

	static speed = 1;
	static actions = [];
	static players = [ new PlayerSide(true), new PlayerSide(false) ];
	static lastTime = -1;
	static lastTimer = -1;
	static timeLastYourAction = 0;
	static timeLastTheirAction = 0;
	static _currentActionIterator = 0;
	static _sleepFrames = 0;
	static _mulliganCardsDrawn = 0;

	static skipToAction(actionIterator) {
		console.log(`Reinitialising field until action ${actionIterator}..`);
		AnimationEffect.skippingToPoint = true; // Let it know that we're not accepting any animations with a duration > 0

		this.players = [ new PlayerSide(true), new PlayerSide(false) ];
		this.lastTime = -1;
		this.lastTimer = -1;
		this.timeLastYourAction = 0;
		this.timeLastTheirAction = 0;
		this._mulliganCardsDrawn = 0;

		Scene.reset();

		Replay.players[0].deck.prepare();
		Replay.players[1].deck.prepare();

		// For each action until this one, play it immediately at full speed.
		for (let i = 0; i < actionIterator; i++) {
			Replay.actions[i].startPlay(true);
		}

		this._currentActionIterator = actionIterator;
		AnimationEffect.skippingToPoint = false;
		
		this._sleepFrames = 20;
	}

	static getActions(data) {

		// {
		// 	type: "draw" | "place" | "place_spell" | "enemy_place" | "enemy_place_spell" 
		// 			| "place_died" | "enemy_place_died" | "spell_remove" | "enemy_spell_remove" 
		//			| "play" | "enemy_play";
		// 	code: string;
		// 	id: string;
		// };

		const actionName = data.type;
		const defaultIsYou = data.type.indexOf("enemy") < 0; // If action starts with enemy, it's not you.
		const defaultIsThem = !defaultIsYou; // TODO: The one does not exclude the other, unfortunately.
		switch (actionName) {
			case "mulligan":
				const fakeCards = [ "", "", "", "" ];
				return [
					new ShowMulliganCards(defaultIsYou, data.initialCards, data.finalCards),
					new ShowMulliganCards(!defaultIsYou, fakeCards, fakeCards), // Fake mulligans for opponent
					new ReplaceMulliganCards(defaultIsYou, data.initialCards, data.finalCards),
					new ReplaceMulliganCards(!defaultIsYou, fakeCards, fakeCards),
				];

			case "draw":
				// The first 4 draws are actually mulligans moving to hand. Intercept this.
				if (this.resolveFirstDraws(data))
					return [];

				// It's a real draw.
				return [
					new DrawCard(defaultIsYou, { code: data.code, id: data.id }),
					new DrawCard(!defaultIsYou, new CardData("", "")), // Bring in a fake draw for the opponent
				];

			case "enemy_place":
				this.identifyEnemyHandCard({ code: data.code, id: data.id}); 
				// We found a card they used that we can identify. Give one of their fake cards an identity

			case "place":
				return [ 
					new PlayCardToBench(defaultIsYou, { code: data.code, id: data.id}),
				];

			case "play":
			case "enemy_play":
				return [
					new SetupCardsForAttackAction(defaultIsYou, { code: data.code, id: data.id}),
				];

			case "fight":
				// {
				// 	type: "fight";
				// 	matchups: {
				// 		ourCardID: string | null;
				// 		enemyCardID: string | null;
				// 		survivorCardIDs: string[];
				// 	}[];
				// }
				return [
					new ResolveFight(true, true, data.matchups),
				];
			
			case "place_died":
			case "enemy_place_died":
				return [
					new KillUnitAction(defaultIsYou, { code: data.code, id: data.id}),
				];

			case "enemy_place_spell":
			case "place_spell":
			
			case "spell_remove":
			case "enemy_spell_remove":

			default:
				console.error(`Unknown action '${actionName}'! Args given:`, data); // TODO: re-enable this.
				return [];
		}
	}

	static getExistingAction(name) {
		for (let actionData of this.actions)
			if (actionData.name == name)
				return actionData;

		return null;
	}
	
	static play(actions) {
		requestAnimationFrame(Replay.play); // Prepare next frame.

		const deltaMs = (performance.now() - Replay.lastTimer) * Replay.speed;
		const timeMs = Replay.lastTime >= 0 ? Replay.lastTime + deltaMs : 0;
		
		if (typeof actions !== 'number') { // Add new actions
			console.log(`Adding ${actions.length} new actions..`);
			for (let actionData of actions) {
				const actions = Replay.getActions(actionData);
				Replay.actions.push(...actions);
			}

			Replay.players[0].deck.prepare();
			Replay.players[1].deck.prepare();

			Replay.timeLastYourAction = timeMs;
		}

		if (Replay.currentAction) {

			// If we started and we're done too.
			if (Replay.currentAction.hasStarted) {
				if (Replay.currentAction.isDone(timeMs)) {

					if (Replay.currentAction.isYou)
						Replay.timeLastYourAction = timeMs;
					else 
						Replay.timeLastTheirAction = timeMs;
					Replay._currentActionIterator++; // Go to next action
					
					if (Replay.currentAction) {
						console.log(`Current action done. Will start ${Replay.currentAction.name} soon.`);
					}
					else {
						console.log(`All replay actions played..`);
					}
				}
			}
			else if (Replay.currentAction.isReadyToPlay(timeMs)) {
				Replay.currentAction.startPlay(/* skipAnimations = */false);
				
				if (Replay.actions.length == Replay._currentActionIterator) {
					console.log("Replay is done!");
				}
			}
		}

		if (Replay.onFrame)
			Replay.onFrame(timeMs);

		Replay.lastTime = timeMs;
		Replay.lastTimer = performance.now();
		Scene.update(timeMs);
	}

	static identifyEnemyHandCard(cardIdent) {

		// Get all cards for enemy actions.
		const cardArrays = this.actions.filter(a => !a.isYou).map(a => a.deckCardData);
		let cards = [].concat.apply([], cardArrays); // flatten array
		cards = cards.filter(c => c.code == "");

		// const card = cards[Math.floor(Math.random() * cards.length)]; // TODO: Turn this back on. It's currently turned off because for some reason, it sometimes can't find the card..
		const card = cards[0];

		card.id = cardIdent.id;
		card.code = cardIdent.code;
		console.log(`Identified card in enemy hand`, cardIdent);
	}

	static get currentAction() {
		return this.actions[this._currentActionIterator];
	}

	static get you() {
		return Replay.players[1];
	}

	static get opponent() {
		return Replay.players[0];
	}

	static lastTimeAction(isYou) {
		return isYou ? this.timeLastYourAction : this.timeLastTheirAction;
	}
	
	static get lastTimeAnyAction() {
		return Math.max(this.timeLastYourAction, this.timeLastTheirAction);
	}

	static resolveFirstDraws(data) {
		const show = Replay.getExistingAction("ShowMulliganCards");
		const replace = Replay.getExistingAction("ReplaceMulliganCards");

		if (!show || !replace) {
			console.error("Can't find the show or replace mulligan card actions, but we're drawing a card? Huh?!");
		}
		else if (!replace.isIdentified) {
			show.identifyCard(data.code, data.id);
			replace.identifyCard(data.code, data.id);
			return true;
		}

		return false;
	}
}
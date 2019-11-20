import PlayerSide from "./player_side.js";
import Scene from "./scene.js";
import ShowMulliganCards from "./actions/show_mulligan_cards.js";
import ReplaceMulliganCards from "./actions/replace_mulligan_cards.js";
import DrawCard from "./actions/draw_card.js";
import RoundStart from "./actions/round_start.js";
import PlayCardToBench from "./actions/play_card_to_bench.js";
import AnimationEffect from "./animation_effect.js";

export default class Replay {

	static speed = 1;
	static actions = [];
	static players = [ new PlayerSide(true), new PlayerSide(false) ];
	static lastTime = -1;
	static lastTimer = -1;
	static timeSinceLastAction = 0;
	static _currentActionIterator = 0;
	static _sleepFrames = 0;

	static skipToAction(actionIterator) {
		debug.log(`Reinitialising field until action ${actionIterator}..`);
		AnimationEffect.skippingToPoint = true; // Let it know that we're not accepting any animations with a duration > 0

		this.players = [ new PlayerSide(true), new PlayerSide(false) ];
		this.lastTime = -1;
		this.lastTimer = -1;
		this.timeSinceLastAction = 0;

		Scene.reset();

		Replay.players[0].deck.prepare();
		Replay.players[1].deck.prepare();

		// For each action until this one, play it immediately at full speed.
		for (let i = 0; i < actionIterator; i++) {
			Replay.actions[i].resolveImmediately();
		}

		this._currentActionIterator = actionIterator;
		AnimationEffect.skippingToPoint = false;
		
		this._sleepFrames = 20;
	}

	static getActions(data) {

		// type V3Action = {
		// 	type: "mulligan",
		// 	initialCards: string[];
		// 	finalCards: string[];
		// }

		// {
		// 	type: "fight";
		// 	matchups: {
		// 		ourCardID: string | null;
		// 		enemyCardID: string | null;
		// 		survivorCardIDs: string[];
		// 	}[];
		// }

		// {
		// 	type: "draw" | "place" | "place_spell" | "enemy_place" | "enemy_place_spell" 
		// 			| "place_died" | "enemy_place_died" | "spell_remove" | "enemy_spell_remove" 
		//			| "play" | "enemy_play";
		// 	code: string;
		// 	id: string;
		// };

		const actionName = data.type;
		const isYou = data.type.indexOf("enemy") < 0; // If action starts with enemy, it's not you.
		switch (actionName) {
			case "mulligan":
				return [
					new ShowMulliganCards(isYou, data.initialCards, data.finalCards),
					new ReplaceMulliganCards(isYou, data.initialCards, data.finalCards),
				];

			case "draw":
				return [ 
					new DrawCard(isYou, { code: data.code, id: data.id}),
					new DrawCard(!isYou, { code: data.code, id: data.id}), // TODO: Make it real.
				];

			case "place":
			case "enemy_place":
				return [ 
					new PlayCardToBench(isYou, { code: data.code, id: data.id}),
				];

			default:
				throw new Error(`Unknown action '${actionName}'! Args given:`, data);
		}
	}
	
	static play(actions) {
		
		if (typeof actions !== 'number') { // Add new actions
			debug.log(`Adding ${actions.length} new actions..`);
			for (let actionData of actions) {
				const actions = Replay.getActions(actionData);
				Replay.actions.push(...actions);
			}

			Replay.players[0].deck.prepare();
			Replay.players[1].deck.prepare();
		}

		requestAnimationFrame(Replay.play); // Prepare next frame.

		const deltaMs = (performance.now() - Replay.lastTimer) * Replay.speed;
		const timeMs = Replay.lastTime >= 0 ? Replay.lastTime + deltaMs : 0;

		while (Replay.currentAction && Replay.currentAction.isReadyToPlay(timeMs)) {
			Replay.currentAction.play();
			Replay._currentActionIterator++;
			Replay.timeSinceLastAction = performance.now();
			
			if (Replay.actions.length == Replay._currentActionIterator) {
				debug.log("Replay is done!");
				break;
			}
		}

		Replay.lastTime = timeMs;
		Replay.lastTimer = performance.now();
		Scene.update(timeMs);
	}

	static get currentAction() {
		return this.actions[this._currentActionIterator];
	}

	static get timeMulliganResolved() {
		return Math.max(this.players[0].mulliganView.resolveTime, this.players[1].mulliganView.resolveTime);
	}

	static get you() {
		return Replay.players[1];
	}

	static get opponent() {
		return Replay.players[0];
	}
}
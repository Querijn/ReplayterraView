import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import DummyCard from "../dummy_card.js";
import Animation from "../animation/animation.js";
import AnimationEffect from "../animation/animation_effect.js";
import AnimationDelay from "../animation/animation_delay.js";
import * as Easing from "../easing.js";

export default class ResolveFight extends BaseAction {

	animations = [];

	constructor(isYou, isThem, matchUps) {
		super("ResolveFight", isYou, isThem);

		this.isThem = isThem; // Temp until becomes base
		this.matchUps = matchUps;

		this.done = false;

		//	{
		//		ourCardID: string | null;
		//		enemyCardID: string | null;
		//		survivorCardIDs: string[];
		//	}[];
	}

	isReadyToPlay(timeMs) {
		if (Replay.lastTimeAnyAction < 0 || timeMs <= 0)
			return false;

		return timeMs - Replay.lastTimeAnyAction > 200;
	}

	isDone(timeMs) {
		return this.done;
	}

	play(skipAnimations) {

		let fixPosAnim = null;
		for (let i = 0; i < this.matchUps.length; i++) {
			let match = this.matchUps[i];
			const yourCard = match.ourCardID ? Replay.you.field.cards.find(c => c.id == match.ourCardID) : new DummyCard(true);
			const theirCard = match.enemyCardID ? Replay.opponent.field.cards.find(c => c.id == match.enemyCardID) : new DummyCard(false);

			if (!match.ourCardID) { // Make sure dummy cards are in our field
				fixPosAnim = Replay.you.field.addAtIndex(yourCard, i, skipAnimations);
			}
			else if (!yourCard) {
				debugger;
			}

			if (!match.enemyCardID) {
				fixPosAnim = Replay.opponent.field.addAtIndex(theirCard, i, skipAnimations);
			}
			else if (!theirCard) {
				debugger;
			}
		}

		if (skipAnimations) {
			this.onFightDone(skipAnimations);
		}
		else if (fixPosAnim) {
			fixPosAnim
			.add(new AnimationDelay(500))
			.onDone(() => { // Fight
				this.doFightAnimation();
			});
		}
		else {
			this.doFightAnimation();
		}
		
	}

	doFightAnimation() {
		let lastAnim = null;
		for (let i = Replay.you.field.cards.length - 1; i >= 0; i--) {
			const cards = [
				Replay.you.field.cards[i],
				Replay.opponent.field.cards[i] 
			];

			for (let j = 0; j < cards.length; j++) {
				const card = cards[j];
				const up = j == 1 ? 1 : -1;

				const anim = card.addAnimation()
				.add(new AnimationDelay((Replay.you.field.cards.length - i) * 320))
				.add(new AnimationEffect(Easing.linear, card.position, "y", card.position.y - up * 30,	240))
				.add(new AnimationEffect(Easing.linear, card.position, "y", card.position.y + up * 70,	80))
				.add(new AnimationEffect(Easing.linear, card.position, "y", card.position.y, 			120));

				if (!lastAnim || anim.length > lastAnim.length)
					lastAnim = anim;
			}
		}

		// If all our animations have been played, end the fight
		lastAnim.onDone(() => {
			this.onFightDone(false);
		});
	}

	onFightDone(skipAnimations) {
		for (let i =  this.matchUps.length - 1; i >= 0; i--) {
			const match = this.matchUps[i];
			const weSurvived = match.ourCardID ? match.survivorCardIDs.some(id => id == match.ourCardID) : true;
			const theySurvived = match.enemyCardID ? match.survivorCardIDs.some(id => id == match.enemyCardID) : true;

			if (!weSurvived && match.ourCardID) {
				const yourCard = Replay.you.field.cards.find(c => c.id == match.ourCardID);
				if (!yourCard)
					throw new Error("Could not find our card to destroy!");
				Replay.you.field.destroyCard(yourCard, skipAnimations);
			}
			if (!theySurvived && match.enemyCardID) {
				const theirCard = Replay.opponent.field.cards.find(c => c.id == match.enemyCardID);
				if (!theirCard)
					throw new Error("Could not find their card to destroy!");

				Replay.opponent.field.destroyCard(theirCard, skipAnimations);
			}
		}

		Replay.you.field.pruneDummies();
		Replay.opponent.field.pruneDummies();

		const backupMoveAnim = Replay.you.field.moveAllToContainer(Replay.you.bench, skipAnimations);
		const moveAnim = Replay.opponent.field.moveAllToContainer(Replay.opponent.bench, skipAnimations) || backupMoveAnim;

		if (moveAnim) {
			moveAnim.onDone(() => this.done = true);
		}
		else {
			this.done = true;
		}
	}

	get deckCardData() {
		return [];
	}
}
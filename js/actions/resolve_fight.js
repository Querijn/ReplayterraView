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

		return timeMs - Replay.lastTimeAnyAction > 2000;
	}

	isDone(timeMs) {
		return this.done;
	}

	play(skipAnimations) {

		for (let i = 0; i < this.matchUps.length; i++) {
			let match = this.matchUps[i];
			const yourCard = match.ourCardID ? Replay.you.field.cards.find(c => c.id == match.ourCardID) : new DummyCard();
			const theirCard = match.enemyCardID ? Replay.opponent.field.cards.find(c => c.id == match.enemyCardID) : new DummyCard();

			if (!match.ourCardID) { // Make sure dummy cards are in our field
				Replay.you.field.addAtIndex(yourCard, i, skipAnimations);
			}
			if (!match.enemyCardID) {
				Replay.you.field.addAtIndex(theirCard, i, skipAnimations);
			}
		}

		const onFightDone = () => {
			for (let i =  this.matchUps.length - 1; i >= 0; i--) {
				
				const match = this.matchUps[i];
				const weSurvived = match.ourCardID ? match.survivorCardIDs.some(id => id == match.ourCardID) : false;
				const theySurvived = match.enemyCardID ? match.survivorCardIDs.some(id => id == match.enemyCardID) : false;

				if (!weSurvived) {
					Replay.you.field.destroyCardAtIndex(i, skipAnimations);
				}
				if (!theySurvived) {
					Replay.opponent.field.destroyCardAtIndex(i, skipAnimations);
				}
			}

			const moveAnim2 = Replay.you.field.moveAllToContainer(Replay.you.bench, skipAnimations);
			const moveAnim1 = Replay.opponent.field.moveAllToContainer(Replay.opponent.bench, skipAnimations);

			if (moveAnim1) {
				moveAnim1.onDone(() => this.done = true);
			}
			else if (moveAnim2) {
				moveAnim2.onDone(() => this.done = true);
			}
			else {
				this.done = true;
			}
		};

		if (skipAnimations || this.animations.length == 0) {
			onFightDone();
		}
		else {
			this.animations[this.animations.length - 1].onDone(() => { // Fight
				
				let lastAnim = null;
				for (let i = 0; i < Replay.you.field.cards.length; i++) {
					const cards = [
						Replay.you.field.cards[i],
						Replay.opponent.field.cards[i] 
					];

					for (let j = 0; j < cards.length; j++) {
						const card = cards[j];
						const up = j == 0 ? 1 : -1;

						const anim = card.addAnimation()
						.add(new AnimationDelay(i * 320))
						.add(new AnimationEffect(Easing.linear, card.position, "y", card.y - up * 30,	240))
						.add(new AnimationEffect(Easing.linear, card.position, "y", card.y + up * 70,	80))
						.add(new AnimationEffect(Easing.linear, card.position, "y", card.y, 			120));

						lastAnim = anim;
					}
				}

				// If all our animations have been played, end the fight
				if (!lastAnim)
					onFightDone();
				else
					lastAnim.onDone(onFightDone);
			});
		}		
	}

	get deckCardData() {
		return [];
	}
}
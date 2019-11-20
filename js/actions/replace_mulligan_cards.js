import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import CardData from "../card_data.js";
import AnimationDelay from "../animation/animation_delay.js";

export default class ReplaceMulliganCardsAction extends BaseAction {

	oldCards = [];
	newCards = [];

	constructor(isYou, oldCardCodes, finalCards) {
		super("ReplaceMulliganCards");

		ReplaceMulliganCardsAction.settleCount = 0;

		this.isYou = isYou;


		this.indicesToRemove = [];
		for (let i = 0; i < oldCardCodes.length; i++) {

			const oldCode = oldCardCodes[i];
			const finalCode = finalCards[i];

			if (oldCode != finalCode) { // If we replace it
				this.indicesToRemove.push(i);
				this.newCards.push(new CardData("", finalCode));
				this.oldCards.push(new CardData("", oldCode));
			}
		}

		console.log("old cards: ", this.oldCards);
		console.log("new cards: ", this.newCards);
	}
	
	isReadyToPlay(timeMs) {
		if (Replay.timeMulliganResolved < 0)
			return false;

		return timeMs - Replay.timeMulliganResolved > 1000;
	}

	isDone(timeMs) {
		return false;
	}
	
	play(skipAnimations) {

	}

	get deckCardData() {
		return this.newCards;
	}

	isPlayerAction(isYou) {
		return this.isYou == isYou;
	}
	
	identifyCard(code, id) {
		for (const card of this.oldCards) {
			if (card.id === "" && code === card.code) {
				debug.log(`${this.name}: Identified old card ${code} -> ${id}..`);
				card.id = id;
				break;
			}
		}

		for (const card of this.newCards) {
			if (card.id === "" && code === card.code) {
				debug.log(`${this.name}: Identified new card ${code} -> ${id}..`);
				card.id = id;
				return;
			}
		}
	}

	get isIdentified() {
		
		for (const card of this.newCards)
			if (card.id === "")
				return false;
		return true;
	}
}
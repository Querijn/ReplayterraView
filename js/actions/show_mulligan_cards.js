import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import CardData from "../card_data.js";

export default class ShowMulliganCardsAction extends BaseAction {

	cards = [];
	animations = [];

	constructor(isYou, oldCardCodes) {
		super("ShowMulliganCards", isYou);

		for (const oldCardCode of oldCardCodes)
			this.cards.push(new CardData("", oldCardCode));
	}

	isReadyToPlay(timeMs) {

		if (Replay.lastTimeAction(this.isYou) < 0 || timeMs <= 0)
			return false;

		return timeMs - Replay.lastTimeAction(this.isYou) > 2000;
	}

	isDone(timeMs) {
		return this.animations.length == 4 && this.animations.every((a) => a.isDoneAt(timeMs));
	}

	identifyCard(code, id) {
		for (const card of this.cards) {
			if (card.id === "" && code === card.code) {
				debug.log(`${this.name}: Identified ${code} -> ${id}..`);
				card.id = id;
				return;
			}
		}

		// ShowMulliganCards can't identify them all, just ignore.
		// debug.warn(`${this.name}: Could not find card for code ${code}? I wanted to assign ID ${id}..`);
	}

	get isIdentified() {
		
		for (const card of this.cards)
			if (card.id === "")
				return false;
		return true;
	}

	play(skipAnimations) {
		
		const player = this.isYou ? Replay.you : Replay.opponent;
		const drawCard = () => {
			this.animations.push(player.deck.drawFromTop(player.mulligan, skipAnimations)
			.onDone((anim) => {
				anim.owner.showFront(0, skipAnimations ? 0 : 250);
			}));
		}

		drawCard();

		// fuck it
		if (!skipAnimations) {
			setTimeout(drawCard, 250);
			setTimeout(drawCard, 500);
			setTimeout(drawCard, 750);
		}
		else {
			drawCard();
			drawCard();
			drawCard();
		}
	}

	get deckCardData() {
		return this.cards;
	}
}
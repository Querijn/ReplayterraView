import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import CardData from "../card_data.js";
import ReplaceMulliganCardsAction from "./replace_mulligan_cards.js";

export default class DrawCardAction extends BaseAction {

	constructor(isYou, card) {
		super("DrawCard");

		this.isYou = isYou;
		this.card = card;
	}

	isReadyToPlay(timeMs) {
		return ReplaceMulliganCardsAction.timeSettled > 0 && timeMs - ReplaceMulliganCardsAction.timeSettled > 250;
	}

	play() {
		const player = Replay.players[this.isYou ? 0 : 1];
		player.deck.drawToHand(); // Draw a card (these are guaranteed at the top)
	}

	get deckCardData() {
		return [ this.card ];
	}
}
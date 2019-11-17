import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import CardData from "../card_data.js";

export default class ShowMulliganCardsAction extends BaseAction {

	cards = [];

	constructor(isYou, cards) {
		super("ShowMulliganCards");

		this.isYou = isYou;

		for (const cardInfo of cards)
			this.cards.push(new CardData(cardInfo.id, cardInfo.code));
	}

	isReadyToPlay(timeMs) {
		return timeMs > 2000;
	}

	play() {
		const player = Replay.players[this.isYou ? 0 : 1];

		player.deck.drawToMulliganView(); // Draw a card (these are guaranteed at the top)
	}

	get deckCardData() {
		return this.cards;
	}
}
import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import CardData from "../card_data.js";

export default class ShowMulliganCardsAction extends BaseAction {

	cards = [];

	constructor(time, isYou, cards) {
		super("ShowMulliganCards", time);

		this.isYou = isYou;

		for (const cardInfo of cards)
			this.cards.push(new CardData(cardInfo.id, cardInfo.code));
	}

	play() {
		const player = Replay.players[this.isYou ? 0 : 1];

		player.deck.drawToMulliganView(); // Draw a card (these are guaranteed at the top)
	}

	get relatedCardData() {
		return this.cards;
	}
}
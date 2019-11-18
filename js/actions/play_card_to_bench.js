import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import CardData from "../card_data.js";
import ReplaceMulliganCardsAction from "./replace_mulligan_cards.js";

export default class PlayCardToBench extends BaseAction {

	constructor(isYou, card) {
		super("PlayCardToBench");

		this.isYou = isYou;
		this.card = card;
	}

	isReadyToPlay(timeMs) {
		return ReplaceMulliganCardsAction.timeSettled > 0 && timeMs - ReplaceMulliganCardsAction.timeSettled > 250;
	}

	play() {
		const player = this.isYou ? Replay.you : Replay.opponent;
		player.hand.addCardToBench(this.card);
	}

	get deckCardData() {
		return [];
	}

	isPlayerAction(isYou) {
		return this.isYou == isYou;
	}
}
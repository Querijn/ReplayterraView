import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import CardData from "../card_data.js";

export default class RoundStartAction extends BaseAction {

	constructor(roundId, isYou) {
		super("RoundStart");

		this.firstPlayer = isYou ? 0 : 1;
		this.roundId = roundId;
	}

	isReadyToPlay(timeMs) {
		return true;
	}

	play() {
		// Show round text.
	}

	get deckCardData() {
		return [];
	}

	isPlayerAction(isYou) {
		return this.isYou == isYou;
	}
}
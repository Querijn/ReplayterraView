import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import CardData from "../card_data.js";

export default class RoundStartAction extends BaseAction {

	constructor(roundId, isYou) {
		super("RoundStart", isYou);

		this.firstPlayer = isYou ? 0 : 1;
		this.roundId = roundId;
	}

	isReadyToPlay(timeMs) {
		return true;
	}

	isDone(timeMs) {
		return true;
	}

	play(skipAnimations) {
		
	}

	get deckCardData() {
		return [];
	}
}
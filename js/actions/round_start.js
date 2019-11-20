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

	isDone(timeMs) {
		return true;
	}

	play() {
		this._playInternal(false);
	}

	resolveImmediately() {
		this._playInternal(true);
	}

	_playInternal(skipAnimations) {
		debug.log(`${performance.now()}: Playing ${this.name} for ${this.isYou ? "you" : "them"}: ${skipAnimations ? "(skipping animations)" : ""}`);

		// Show round text.
	}

	get deckCardData() {
		return [];
	}

	isPlayerAction(isYou) {
		return this.isYou == isYou;
	}
}
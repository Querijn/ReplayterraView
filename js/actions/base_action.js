import Replay from "../replay.js";

export default class BaseAction {

	constructor(name) {
		this.name = name;
	}

	play() {
		throw new Error("play is not implemented for this action!");
	}

	isReadyToPlay(timeMs) {
		throw new Error("isReadyToPlay is not implemented for this action!");
	}

	resolveImmediately() {
		throw new Error("resolveImmediately is not implemented for this action!");
	}

	get deckCardData() {
		return [];
	}

	isPlayerAction(isYou) {
		return false;
	}
}
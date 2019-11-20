import Replay from "../replay.js";

export default class BaseAction {

	constructor(name) {
		this.name = name;
	}

	startPlay() {
		this.play();
		this._hasStarted = true;
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

	isDone(timeMs) {
		throw new Error("isDone is not implemented for this action!");
	}

	get deckCardData() {
		return [];
	}

	isPlayerAction(isYou) {
		return false;
	}

	get hasStarted() {
		return this._hasStarted;
	}
}
import Replay from "../replay.js";

export default class BaseAction {

	constructor(name, isYou) {
		this.name = name;
		this.isYou = isYou;
		this._hasStarted = false;
	}

	startPlay(skipAnimations) {
		console.log(`Starting ${this.name} action:`, this);
		this.play(skipAnimations);
		this._hasStarted = true;
	}

	play(skipAnimations) {
		throw new Error("play is not implemented for this action!");
	}

	isReadyToPlay(timeMs) {
		throw new Error("isReadyToPlay is not implemented for this action!");
	}

	isDone(timeMs) {
		throw new Error("isDone is not implemented for this action!");
	}

	get deckCardData() {
		return [];
	}

	get hasStarted() {
		return this._hasStarted;
	}
}
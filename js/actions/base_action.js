import Replay from "../replay.js";

export default class BaseAction {

	constructor(name) {
		this.name = name;
	}

	play() {
		throw new Error("play not implemented for this action!");
	}

	isReadyToPlay(timeMs) {
		throw new Error("isReadyToPlay not implemented for this action!");
	}

	destroy() { // Default destroy action
		Replay.actions.splice(0, 1);
	}

	get deckCardData() {
		return [];
	}
}
import Replay from "../replay.js";

export default class BaseAction {

	constructor(name, time) {
		this.name = name;
		this.time = time;
	}

	play() {
		throw new Error("Play not implemented for this action!");
	}

	destroy() { // Default destroy action
		Replay.actions.splice(0, 1);
	}

	get relatedCardData() {
		return [];
	}
}
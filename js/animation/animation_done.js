export default class AnimationDoneHandler {

	constructor(func) { this.onDone = func }

	get isDoneHandler() { return true; }
	isDoneAt(timeMs) { return true; }
	get duration() { return 0; }
}
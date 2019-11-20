import AnimationEffect from "./animation_effect.js";

export default class AnimationDelay extends AnimationEffect {

	constructor(delay) {
		super (() => { return 0;}, { dummy: 0 }, "dummy", 0, delay);
	}
}
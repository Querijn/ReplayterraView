import Scene from "./scene.js";
import Animation from "./animation.js";

export default class RenderObject {

	animations = [];

	constructor() {
		Scene._addRenderObject(this);
	}

	addAnimation() {
		const anim = new Animation();
		this.animations.push(anim);

		return anim;
	}

	beginUpdate(timeMs) {
		this.updateAnimations(timeMs);
		this.update(timeMs);
	}

	updateAnimations(timeMs) {
		for (let animation of this.animations) {
			animation.update(timeMs);
		}
	}

	update() { throw new Error("Not implemented!"); }
}
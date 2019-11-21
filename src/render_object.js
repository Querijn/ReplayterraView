import Scene from "./scene.js";
import Animation from "./animation/animation.js";

export default class RenderObject {

	animations = [];
	quad = null;

	constructor() {
		Scene._addRenderObject(this);
	}

	destroy() {
		Scene._removeRenderObject(this);

		if (this.quad)
			Scene._remove(this.quad);
	}

	addAnimation() {
		const anim = new Animation(this);
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

		this.animations = this.animations.filter(a => !a.isDoneAt(timeMs));
	}

	cancelAnimations() {
		this.animations = [];
	}

	update() { throw new Error("Not implemented!"); }

	isAnimationPlayingAt(timeMs) { 
		for (let animation of this.animations)
			if (animation.isDoneAt(timeMs) === false)
				return true;
		return false;
	}
}
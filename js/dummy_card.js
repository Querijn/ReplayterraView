import Scene from "./scene.js";
import RenderObject from "./render_object.js";
import CardData from "./card_data.js";
import * as Easing from "./easing.js";
import AnimationEffect from "./animation/animation_effect.js";
import AnimationDelay from "./animation/animation_delay.js";
import Animation from "./animation/animation.js";

export default class DummyCard extends RenderObject {

	constructor(cardData, isYours) {
		super();
		this.data = cardData;
		this.isYours = isYours;

		this.position = { x: 0, y: 0, z: 0 };
		this.rotation = { x: 0, y: 0, z: 0 };
	}

	destroy() {
		super.destroy();
		return this.addAnimation();
	}

	update() {
	}

	moveTo(x, y, z = 1, durationMs = 250) {
		return this.addAnimation();
	}

	showFront(delay = 0, durationMs = 250) {
		return this.addAnimation();
	}

	showBack(delay = 0, durationMs = 250) {
		return this.addAnimation();
	}

	_setRot(y, delay = 0, durationMs = 500) {
		return this.addAnimation();
	}
	
	updateScale() {
	}

	get code() { return "DummyCard"; }
	get id() { return "-1"; }
	get isRenderObject() { return true; }
	get isDummy() { return true; }
	get width() { return this.quad && this.quad.parameters && this.quad.geometry ? this.quad.geometry.parameters.width : 1; }
	get height() { return this.quad && this.quad.parameters && this.quad.geometry ? this.quad.geometry.parameters.height : 1; }

	get z() { return this._z || 0; }
	set z(newZ) { this._z = newZ; this.updateScale(); }

	get scale() { return this._scale || 1; }
	set scale(newScale) { this._scale = newScale; this.updateScale(); }

	get showingFront() { return Math.abs(Math.PI - this.rotation.y) < Math.abs(this.rotation.y); }
}
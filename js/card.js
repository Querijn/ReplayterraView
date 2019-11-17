import Scene from "./scene.js";
import RenderObject from "./render_object.js";
import CardData from "./card_data.js";
import * as Easing from "./easing.js";
import AnimationEffect from "./animation_effect.js";
import AnimationDelay from "./animation_delay.js";

export default class Card extends RenderObject {

	static fragShader = null;
	static vertShader = null;

	constructor(id, code, isYours) {
		super();
		this.data = new CardData(id, code);
		this.isYours = isYours;

		if (!Card.fragShader || !Card.vertShader)
			throw new Error("Could not find shaders!");

		const frontTexture = Scene.textureLoader.load(`assets/en_us/img/cards/${code}.png`);
		const backTexture = Scene.textureLoader.load("assets/card_back.png");
		// backTexture.anisotropy = frontTexture.anisotropy = Scene.renderer.getMaxAnisotropy();

		const cardWidth = 680 / 12;
		const cardHeight = 1024 / 12;
		const cardPlane = new THREE.PlaneGeometry(cardWidth, cardHeight);
		const material = new THREE.ShaderMaterial({
			side: THREE.DoubleSide, 
			transparent: true,
			fragmentShader: Card.fragShader,
			vertexShader: Card.vertShader,
			uniforms: {
				texture: { type: "t", value: frontTexture },
				texture2: { type: "t", value: backTexture }
			},
		});

		this.quad = new THREE.Mesh(cardPlane, material);
		Scene._add(this.quad);

		this.position.z = 2;
		this.rotation.z = Math.PI; // Cards are upside down because I want topleft to be 0, 0

		this.scale = 1;
		this.z = 1;
	}

	update() {
		// this.rotation.y += 0.02;
	}

	moveTo(x, y, z = 1, durationMs = 250, resetRot = true, resetScale = false) {

		if (durationMs === 0) {
			this.position.x = x;
			this.position.y = y;
			this.z = z;

			if (resetScale) {
				this.scale = scale;
			}
			
			if (resetRot) {
				this.rotation.z = this.isYours ? Math.PI : 0;
			}
			return;
		}

		const animation = 
		this.addAnimation().add(new AnimationEffect(Easing.easeInOutQuad, this.position, "x", x, durationMs));
		this.addAnimation().add(new AnimationEffect(Easing.easeInOutQuad, this.position, "y", y, durationMs));
		this.addAnimation().add(new AnimationEffect(Easing.easeInOutQuad, this, "z", z, durationMs));
		if (resetRot) {
			this.addAnimation().add(new AnimationEffect(Easing.easeInOutQuad, this.rotation, "z", this.isYours ? Math.PI : 0, durationMs));
		}

		if (resetScale) {
			this.addAnimation().add(new AnimationEffect(Easing.easeInOutQuad, this, "scale", 1, durationMs));
		}

		return animation;
	}

	showFront(delay = 300, durationMs = 500) { 

		if (Math.abs(this.rotation.y) < 0.1) { // TODO: Make flip use showBack/showFront rather than this way
			return this.flip(delay, durationMs);
		}

		return this.addAnimation(); // return empty animation
	}

	showBack(delay = 300, durationMs = 500) { 

		if (Math.abs(Math.PI - this.rotation.y) < 0.1) { // TODO: Make flip use showBack/showFront rather than this way
			return this.flip(delay, durationMs);
		}

		return this.addAnimation(); // return empty animation
	}

	flip(delay = 300, durationMs = 500) {

		return this.addAnimation()
		.add(new AnimationDelay(delay))
		.add(new AnimationEffect(Easing.easeInOutQuad, this.rotation, "y", this.rotation.y + Math.PI, durationMs));
	}

	static async loadThreeJSShader() {

		if (this.fragShader && this.vertShader)
			return;

		const fragPromise = fetch("shader/card.frag");
		const vertPromise = fetch("shader/default.vert");
		
		const [ fragResponse, vertResponse ] = await Promise.all([ fragPromise, vertPromise ]);

		if (!fragResponse.ok || !vertResponse.ok)
			throw new Error("Could not find shaders!");

		this.fragShader = await fragResponse.text();
		this.vertShader = await vertResponse.text();
		
		console.log("Card shader loaded.");
	}
	
	updateScale() { 
		this.quad.scale.x = this.quad.scale.y = this.scale * (1.0 - (this.z * 0.03));

		this.position.z = 255 - this.z;
	}

	get code() { return this.data.code; }
	get id() { return this.data.id; }
	get isRenderObject() { return true; }
	get position() { return this.quad.position; }
	get rotation() { return this.quad.rotation; }
	get width() { return this.quad && this.quad.parameters && this.quad.geometry ? this.quad.geometry.parameters.width : 1; }
	get height() { return this.quad && this.quad.parameters && this.quad.geometry ? this.quad.geometry.parameters.height : 1; }

	get z() { return this._z; }
	set z(newZ) { this._z = newZ; this.updateScale(); }

	get scale() { return this._scale; }
	set scale(newScale) { this._scale = newScale; this.updateScale(); }
}
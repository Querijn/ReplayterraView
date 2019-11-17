import Scene from "./scene.js";
import RenderObject from "./render_object.js";
import CardData from "./card_data.js";
import * as Easing from "./easing.js";
import AnimationEffect from "./animation_effect.js";

export default class Card extends RenderObject {

	static fragShader = null;
	static vertShader = null;

	constructor(id, code) {
		super();
		this.data = new CardData(id, code);

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
	}

	update() {
		// this.rotation.y += 0.02;
	}

	moveTo(x, y, durationMs = 250) {

		if (durationMs === 0) {
			this.position.x = x;
			this.position.y = y;
			return;
		}

		console.log(`Moving card ${this.code} to ${x}, ${y} within ${durationMs} ms.`);
		return this.addAnimation()
		.add(new AnimationEffect(Easing.easeInOutQuad, this.position, "x", x, durationMs))
		.add(new AnimationEffect(Easing.easeInOutQuad, this.position, "y", x, durationMs));
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

	get code() { return this.data.code; }
	get id() { return this.data.id; }
	get isRenderObject() { return true; }
	get position() { return this.quad.position; }
	get rotation() { return this.quad.rotation; }
}
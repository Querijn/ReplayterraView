import Card from "./card.js";

export default class Scene {

	static isThreeJS = false;
	static scene = null;
	static camera = null;
	static textureLoader = null;
	static renderObjects = [];

	static async loadAsThreeJS() {

		window.onresize = Scene._onResize;

		this.isThreeJS = true;

		this.scene = new THREE.Scene();

		this.width = 800; // window.innerWidth; // TODO: Fix this
		this.height = 600; // window.innerHeight;

		this.camera = new THREE.OrthographicCamera(0, this.width, 0, this.height, 0, 10000);
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.camera.position.z = 680;

		Scene.renderer.setSize(window.innerWidth, window.innerHeight); // TODO: When the above TODO is fixed, change this to this.width and this.height
		document.body.appendChild(this.renderer.domElement);

		this.textureLoader = new THREE.TextureLoader();

		await Card.loadThreeJSShader();
	}

	static _onResize() { 

		if (Scene.isThreeJS) {
			Scene.camera.right = this.width;
			Scene.camera.bottom = this.height;
			Scene.camera.updateProjectionMatrix();
			
			Scene.renderer.setSize(window.innerWidth, window.innerHeight);
		}
	}

	static _add(mesh) {
		if (!this.isThreeJS)
			throw new Error("Not implemented");

		this.scene.add(mesh);
	}

	static _addRenderObject(obj) {
		this.renderObjects.push(obj);
	}

	static update(timeMs) {
		
		for (const renderObject of Scene.renderObjects) {
			renderObject.beginUpdate(timeMs);
		}

		if (Scene.isThreeJS) {
			Scene.renderer.render(Scene.scene, Scene.camera);
		}
	}
}
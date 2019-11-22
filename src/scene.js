import * as THREE from "three";
import Card from "./card.js";

export default class Scene {
  static isThreeJS = false;
  static scene = null;
  static camera = null;
  static textureLoader = null;
  static renderObjects = [];

  static async _getThreeJS() {
    return new Promise((resolve, reject) => {
      const name = "ReplayterraEngine";
      let script = document.getElementById(name);
      if (script) {
        resolve(script);
        return;
      }

      script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "three.min.js";
      script.id = name;
      script.addEventListener("load", () => resolve(script), false);
      script.addEventListener("error", () => reject(script), false);
      document.body.appendChild(script);
    });
  }

  static async loadAsThreeJS(canvas) {
    canvas.onresize = Scene.reset;

    this.isThreeJS = true;
    this.domElement = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });

    this.reset();

    await Card.loadThreeJSShader();
  }

  static _onResize() {
    return; // todo: fix this
    if (Scene.isThreeJS) {
      Scene.camera.right = this.width;
      Scene.camera.bottom = this.height;
      Scene.camera.updateProjectionMatrix();

      Scene.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  static _add(mesh) {
    if (!this.isThreeJS) throw new Error("Not implemented");

    this.scene.add(mesh);
  }

  static _remove(mesh) {
    if (!this.isThreeJS) throw new Error("Not implemented");

    this.scene.remove(mesh);
  }

  static _addRenderObject(obj) {
    this.renderObjects.push(obj);
  }

  static _removeRenderObject(obj) {
    const index = this.renderObjects.findIndex(o => o === obj);
    if (index < 0) throw new Error("Could not find Render Object to remove!");
    this.renderObjects.splice(index, 1)[0];
  }

  static update(timeMs) {
    for (const renderObject of Scene.renderObjects) {
      renderObject.beginUpdate(timeMs);
    }

    if (Scene.isThreeJS) {
      Scene.renderer.render(Scene.scene, Scene.camera);
    }
  }

  static reset() {
    if (this.isThreeJS) {
      this.scene = new THREE.Scene();

      this.width = this.domElement.offsetWidth; // window.innerWidth; // TODO: Fix this
      this.height = this.domElement.offsetWidth * 0.75; // window.innerHeight;

      this.textureLoader = new THREE.TextureLoader();
      const background = new THREE.PlaneGeometry(this.width, this.height);
      const material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        map: this.textureLoader.load("assets/background.jpg")
      });
      const quad = new THREE.Mesh(background, material);
      this.scene.add(quad);
      quad.rotation.z = Math.PI;
      quad.position.x = this.width / 2;
      quad.position.y = this.height / 2;

      this.camera = new THREE.OrthographicCamera(
        0,
        this.width,
        0,
        this.height,
        0,
        10000
      );
      this.camera.position.z = 680;
    }

    Scene.renderer.setSize(this.width, this.height);
  }

  static get areAnimationsPlaying() {
    for (const renderObject of Scene.renderObjects)
      if (renderObject.isAnimationPlaying) return true;
  }
}

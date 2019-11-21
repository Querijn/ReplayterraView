// import regeneratorRuntime from "regenerator-runtime.js";
import Scene from "./scene.js";
import Replay from "./replay.js";

async function test() {
	console.log("ReplayterraView opened.");

	await Scene.loadAsThreeJS();
	document.body.appendChild(Scene.renderer.domElement);

	const urlParams = new URLSearchParams(window.location.search);
	const replayRequest = urlParams.get('replay') || "assets/test.json";

	const response = await fetch(replayRequest);
	const actions = await response.json();

	Replay.play(actions);
}

test();

import Scene from "./scene.js";
import Replay from "./replay.js";

async function main() {
	debug.log("ReplayterraView opened.");

	await Scene.loadAsThreeJS();

	const urlParams = new URLSearchParams(window.location.search);
	const replayRequest = urlParams.get('replay') || "assets/test.json";

	const response = await fetch(replayRequest);
	const actions = await response.json();

	Replay.play(actions);
}

main();

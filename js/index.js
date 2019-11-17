import Scene from "./scene.js";
import Replay from "./replay.js";

async function main() {
	console.log("ReplayterraView opened.");

	await Scene.loadAsThreeJS();

	const fakeActions = [
		{ 
			name: "ShowMulliganCards", 
			time: 1750, 
			isYou: true, 
			cards: [
				{ id: "0", code: "01DE001" },
				{ id: "1", code: "01DE002" },
				{ id: "2", code: "01DE003" },
				{ id: "3", code: "01DE004" }, 
			]
		},
		
		{ 
			name: "ShowMulliganCards", 
			time: 1750, 
			isYou: false, 
			cards: [
				{ id: "4", code: "01DE001" },
				{ id: "5", code: "01DE001" },
				{ id: "6", code: "01DE001" },
				{ id: "7", code: "01DE001" }, 
			]
		}
	]

	Replay.play(fakeActions);
}

main();

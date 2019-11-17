import Scene from "./scene.js";
import Replay from "./replay.js";

async function main() {
	console.log("ReplayterraView opened.");

	await Scene.loadAsThreeJS();

	const fakeActions = [
		{ 
			name: "ShowMulliganCards",
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
			isYou: false, 
			cards: [
				{ id: "4", code: "01DE001" },
				{ id: "5", code: "01DE001" },
				{ id: "6", code: "01DE001" },
				{ id: "7", code: "01DE001" }, 
			]
		},

		{ 
			name: "ReplaceMulliganCards",
			isYou: true, 
			oldCards: [
				{ id: "2", code: "01DE003" },
				{ id: "3", code: "01DE004" }, 
			],
			newCards: [
				{ id: "8", code: "01DE010" },
				{ id: "9", code: "01DE011" }, 
			]
		},
		
		{ 
			name: "ReplaceMulliganCards",
			isYou: false, 
			oldCards: [
				{ id: "5", code: "01DE001" },
				{ id: "7", code: "01DE001" }, 
			],
			newCards: [
				{ id: "8", code: "01DE010" },
				{ id: "9", code: "01DE011" }, 
			]
		},
	]

	Replay.play(fakeActions);
}

main();

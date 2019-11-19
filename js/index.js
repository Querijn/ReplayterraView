import Scene from "./scene.js";
import Replay from "./replay.js";

console.warn = () => {};

async function main() {
	debug.log("ReplayterraView opened.");

	await Scene.loadAsThreeJS();

	const fakeActions = [
		{ 
			name: "ShowMulliganCards",
			isYou: true, 
			cards: [
				{ id: "1_0", code: "01DE001" },
				{ id: "1_1", code: "01DE002" },
				{ id: "1_2", code: "01DE003" },
				{ id: "1_3", code: "01DE004" }, 
			]
		},
		
		{ 
			name: "ShowMulliganCards",
			isYou: false, 
			cards: [
				{ id: "2_0", code: "01DE001" },
				{ id: "2_1", code: "01DE002" },
				{ id: "2_2", code: "01DE003" },
				{ id: "2_3", code: "01DE004" }, 
			]
		},

		{ 
			name: "ReplaceMulliganCards",
			isYou: true, 
			oldCards: [
				{ id: "1_2", code: "01DE003" },
				{ id: "1_3", code: "01DE004" }, 
			],
			newCards: [
				{ id: "1_4", code: "01DE010" },
				{ id: "1_5", code: "01DE011" }, 
			]
		},
		
		{ 
			name: "ReplaceMulliganCards",
			isYou: false, 
			oldCards: [
				{ id: "2_0", code: "01DE001" },
				{ id: "2_1", code: "01DE001" }, 
			],
			newCards: [
				{ id: "2_4", code: "01DE010" },
				{ id: "2_5", code: "01DE011" }, 
			]
		},
		
		{ 
			name: "DrawCard",
			isYou: false, 
			card: { id: "2_6", code: "01DE011" }, 
		},
		
		{ 
			name: "DrawCard",
			isYou: true, 
			card: { id: "1_6", code: "01DE011" }, 
		},
		
		{ 
			name: "RoundStart",
			roundId: 0
		},
		
		{ 
			name: "PlayCardToBench",
			isYou: true, 
			card: { id: "1_0", code: "01DE001" }, 
		},
		
		{ 
			name: "PlayCardToBench",
			isYou: false, 
			card: { id: "2_0", code: "01DE001" }, 
		},
	]

	Replay.play(fakeActions);
}

main();

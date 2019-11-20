import Scene from "./scene.js";
import Replay from "./replay.js";

async function main() {
	debug.log("ReplayterraView opened.");

	await Scene.loadAsThreeJS();

	// type V3Action = {
	// 	type: "mulligan",
	// 	initialCards: string[];
	// 	finalCards: string[];
	// }

	// {
	// 	type: "fight";
	// 	matchups: {
	// 		ourCardID: string | null;
	// 		enemyCardID: string | null;
	// 		survivorCardIDs: string[];
	// 	}[];
	// }

	// {
	// 	type: "draw" | "place" | "place_spell" | "enemy_place" | "enemy_place_spell" 
	// 			| "place_died" | "enemy_place_died" | "spell_remove" | "enemy_spell_remove" 
	//			| "play" | "enemy_play";
	// 	code: string;
	// 	id: string;
	// };

	const fakeActions = [
		{ 
			type: "mulligan",
			initialCards: [
				{ id: "1_0", code: "01DE001" },
				{ id: "1_1", code: "01DE002" },
				{ id: "1_2", code: "01DE003" },
				{ id: "1_3", code: "01DE004" }, 
			],
			finalCards: [
				"1_0",
				"1_1", 
				"1_4", 
				"1_5", 
			],
		},
		
		{ 
			type: "draw",
			id: "1_6", 
			code: "01DE011", 
		},

		{ 
			type: "place",
			id: "1_0", 
			code: "01DE001", 
		},
		
		{ 
			type: "enemy_place",
			id: "2_0", 
			code: "01DE001", 
		},
		
		// { 
		// 	type: "play",
		// 	id: "1_0", 
		// 	code: "01DE001", 
		// },
	]

	Replay.play(fakeActions);
}

main();

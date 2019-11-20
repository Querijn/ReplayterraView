import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import Scene from "../scene.js";

export default class PlayCardToBench extends BaseAction {

	constructor(isYou, card) {
		super("PlayCardToBench");

		this.isYou = isYou;
		this.card = card;

		this.time = -1;
	}

	isReadyToPlay(timeMs) {
		// Wait for animations to finish
		const player = this.isYou ? Replay.you : Replay.opponent;
		if (Scene.areAnimationsPlaying) {
			this.time = -1;
			return false;
		}

		// Init timer
		if (this.time < 0) {
			this.time = timeMs;
			return false;
		}

		// Wait 1 sec
		return timeMs - this.time > 1000;
	}

	play(timeMs, skipAnimations) {
		debug.log(`${timeMs}: Playing ${this.name} for ${this.isYou ? "you" : "them"}: ${skipAnimations ? "(skipping animations)" : ""}`);
		
		const player = this.isYou ? Replay.you : Replay.opponent;
		player.hand.addCardToBench(this.card);
	}

	get deckCardData() {
		return [];
	}

	isPlayerAction(isYou) {
		return this.isYou == isYou;
	}
}
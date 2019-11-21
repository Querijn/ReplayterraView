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
		if (Replay.timeLastAction < 0)
			return false;

		return timeMs - Replay.timeLastAction > 1000;
	}

	isDone(timeMs) {
		return this.animation && this.animation.isDoneAt(timeMs);
	}

	play(skipAnimations) {
		debug.log(`Playing ${this.name} for ${this.isYou ? "you" : "them"}: CardID = ${this.card.id} ${skipAnimations ? "(skipping animations)" : ""}`);
		
		const player = this.isYou ? Replay.you : Replay.opponent;
		const card = player.hand.cards.find(c => c.id == this.card.id);
		if (!card)
			throw new Error(`Tried to play a card you ${this.isYou ? "you" : "they"} don't have (${this.card.id})!`);

		this.animation = player.hand.moveToContainer(card, player.bench, skipAnimations);
	}

	get deckCardData() {
		return [];
	}

	isPlayerAction(isYou) {
		return this.isYou == isYou;
	}
}
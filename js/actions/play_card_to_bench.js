import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import Scene from "../scene.js";

export default class PlayCardToBench extends BaseAction {

	constructor(isYou, card) {
		super("PlayCardToBench", isYou);
		
		this.card = card;

		this.time = -1;
	}

	isReadyToPlay(timeMs) {
		if (Replay.lastTimeAction(this.isYou) < 0)
			return false;

		return timeMs - Replay.lastTimeAction(this.isYou) > 1000;
	}

	isDone(timeMs) {
		return this.animation && this.animation.isDoneAt(timeMs);
	}

	play(skipAnimations) {
		debug.log(`Playing ${this.name} for ${this.isYou ? "you" : "them"}: CardID = ${this.card.id} ${skipAnimations ? "(skipping animations)" : ""}`);
		
		const player = this.isYou ? Replay.you : Replay.opponent;
		const card = player.hand.cards.find(c => c.id == this.card.id);
		if (!card) {
			debug.warn(`Tried to place a card on the bench that ${this.isYou ? "you" : "they"} don't have (${this.card.id}/${this.card.code})! We're adding it to the bench from thin air.`);
			this.animation = player.bench.addCardsToTop([ this.card ], skipAnimations);
			return;
		}
			
		this.animation = player.hand.moveToContainer(card, player.bench, skipAnimations);
	}

	get deckCardData() {
		return [];
	}
}
import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import Scene from "../scene.js";

export default class SetupCardsForAttackAction extends BaseAction {

	constructor(isYou, card) {
		super("SetupCardsForAttack", isYou);

		this.card = card;
	}

	isReadyToPlay(timeMs) {
		if (Replay.lastTimeAnyAction < 0 || timeMs <= 0)
			return false;

		return timeMs - Replay.lastTimeAnyAction > 2000;
	}

	isDone(timeMs) {
		return this.animation && this.animation.isDoneAt(timeMs);
	}

	play(skipAnimations) {

		const player = this.isYou ? Replay.you : Replay.opponent;
		const benchedCard = player.bench.cards.find(c => c.id == this.card.id);
		if (benchedCard == null)
			throw new Error(`Could not find card ${this.card.id}!`);
		
		this.animation = player.bench.moveToContainer(benchedCard, player.field, skipAnimations);
	}

	get deckCardData() {
		return [];
	}
}
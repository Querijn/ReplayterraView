import BaseAction from "./base_action";
import Replay from "../replay";
import Scene from "../scene";
import ReplaceMulliganCardsAction from "./replace_mulligan_cards";

export default class DrawCardAction extends BaseAction {

	constructor(isYou, card) {
		super("DrawCard", isYou);
		
		this.card = card;
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
		const player = this.isYou ? Replay.you : Replay.opponent;
		console.log(`Playing ${this.name} for ${this.isYou ? "you" : "them"}: ${player.deck.cards[0].code}/${player.deck.cards[0].id} ${skipAnimations ? "(skipping animations)" : ""}`);
		
		player.deck.drawFromTop(player.hand, skipAnimations)
		.onDone((anim) => {
			this.animation = anim.owner.showFront();
		});
	}

	get deckCardData() {
		return [ this.card ];
	}
}
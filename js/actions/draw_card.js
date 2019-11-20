import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import Scene from "../scene.js";
import ReplaceMulliganCardsAction from "./replace_mulligan_cards.js";

export default class DrawCardAction extends BaseAction {

	constructor(isYou, card) {
		super("DrawCard");

		this.isYou = isYou;
		this.card = card;
	}

	isReadyToPlay(timeMs) {
		return this.isReplaceMulliganDone(timeMs) && this.isReadyToPlayDuringRound(timeMs);
	}

	isDone(timeMs) {
		return this.animation && this.animation.isDone;
	}

	isReplaceMulliganDone(timeMs) {
		if (ReplaceMulliganCardsAction.timeSettled > 0 && timeMs - ReplaceMulliganCardsAction.timeSettled > 250) {
			return true;
		}

		this.time = -1;
		return false;
	}
	
	isReadyToPlayDuringRound(timeMs) {

		// Wait for animations to finish
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

	play() {
		this._playInternal(false);
	}

	resolveImmediately() {
		this._playInternal(true);
	}

	_playInternal(skipAnimations) {
		const player = this.isYou ? Replay.you : Replay.opponent;
		debug.log(`${performance.now()}: Playing ${this.name} for ${this.isYou ? "you" : "them"}: ${player.deck.cards[0].code}/${player.deck.cards[0].id} ${skipAnimations ? "(skipping animations)" : ""}`);
		
		this.animation = player.deck.drawToHand(skipAnimations); // Draw a card (these are guaranteed at the top)
	}

	get deckCardData() {
		return [ this.card ];
	}

	isPlayerAction(isYou) {
		return this.isYou == isYou;
	}
}
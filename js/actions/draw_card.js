import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import CardData from "../card_data.js";
import ReplaceMulliganCardsAction from "./replace_mulligan_cards.js";

export default class DrawCardAction extends BaseAction {

	constructor(isYou, card) {
		super("DrawCard");

		this.isYou = isYou;
		this.card = card;
	}

	isReadyToPlay(timeMs) {
		return ReplaceMulliganCardsAction.timeSettled > 0 && timeMs - ReplaceMulliganCardsAction.timeSettled > 250;
	}

	play() {
		this._playInternal(false);
	}

	resolveImmediately() {
		this._playInternal(true);
	}

	_playInternal(skipAnimations) {
		debug.log(`${performance.now()}: Playing ${this.name} for ${this.isYou ? "you" : "them"}: ${skipAnimations ? "(skipping animations)" : ""}`);
		
		const player = this.isYou ? Replay.you : Replay.opponent;
		player.deck.drawToHand(skipAnimations); // Draw a card (these are guaranteed at the top)
	}

	get deckCardData() {
		return [ this.card ];
	}

	isPlayerAction(isYou) {
		return this.isYou == isYou;
	}
}
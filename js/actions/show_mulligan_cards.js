import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import CardData from "../card_data.js";

export default class ShowMulliganCardsAction extends BaseAction {

	cards = [];

	constructor(isYou, cards) {
		super("ShowMulliganCards");

		this.isYou = isYou;

		for (const cardInfo of cards)
			this.cards.push(new CardData(cardInfo.id, cardInfo.code));
	}

	isReadyToPlay(timeMs) {
		return timeMs > 1000;
	}

	play() {
		this._playInternal(false);
	}

	resolveImmediately() {
		this._playInternal(true);
	}
	
	_playInternal(skipAnimations) {
		const player = this.isYou ? Replay.you : Replay.opponent;
		debug.log(`${performance.now()}: Playing ${this.name} for ${this.isYou ? "you" : "them"}: deck card count: ${player.deck.cards.length}, mull card count: ${player.mulliganView.cards.length} ${skipAnimations ? "(skipping animations)" : ""}`);

		for (let i = 0; i < 4; i++) {
			debug.log(`- Drawing card ${player.deck.cards[i].data.id} to mulligan`);
		}
		player.deck.drawToMulliganView(null, skipAnimations); // Draw 4 cards (these are guaranteed at the top)
		debug.log(`${player.mulliganView.cards.length} cards in ${this.isYou ? "player" : "opponent"} mulligan`);
		debug.log(`${player.deck.cards.length} cards in ${this.isYou ? "player" : "opponent"} deck`);
	}

	get deckCardData() {
		return this.cards;
	}

	isPlayerAction(isYou) {
		return this.isYou == isYou;
	}
}
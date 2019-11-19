import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import CardData from "../card_data.js";
import AnimationDelay from "../animation_delay.js";

export default class ReplaceMulliganCardsAction extends BaseAction {

	oldCards = [];
	newCards = [];

	constructor(isYou, oldCards, newCards) {
		super("ReplaceMulliganCards");

		ReplaceMulliganCardsAction.settleCount = 0;

		this.isYou = isYou;
		for (const cardInfo of oldCards)
			this.oldCards.push(new CardData(cardInfo.id, cardInfo.code));
		
		for (const cardInfo of newCards)
			this.newCards.push(new CardData(cardInfo.id, cardInfo.code));
	}
	
	isReadyToPlay(timeMs) {
		if (Replay.timeMulliganResolved < 0)
			return false;

		return timeMs - Replay.timeMulliganResolved > 1000;
	}

	static settleCount = 0;
	static timeSettled = -1;
	static settle(skipAnimations) {
		this.settleCount++;
		if (this.settleCount == 2) {
			Replay.opponent.mulliganView.moveToHand(skipAnimations);
			Replay.you.mulliganView.moveToHand(skipAnimations);
			this.timeSettled = performance.now();
		}
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
		
		let pos = 0;
		for (const cardInfo of this.oldCards) {
			const cardIndex = player.mulliganView.cards.findIndex((c) => cardInfo.id == c.id);
			if (cardIndex < 0)
				throw new Error(`Could not find card by ID ${cardInfo.id}`);

			const card = player.mulliganView.cards.splice(cardIndex, 1)[0];
			const cardPos = cardIndex + pos++;
			player.deck.addToBottom(card, skipAnimations).onDone(() => {
				player.deck.drawToMulliganView(cardPos, skipAnimations).onDone(() => {

					card.addAnimation()
					.add(new AnimationDelay(skipAnimations ? 0 : 2000))
					.onDone(() => { 
						ReplaceMulliganCardsAction.settle(skipAnimations);
					});
				});
			});
		}
	}

	get deckCardData() {
		return this.newCards;
	}

	isPlayerAction(isYou) {
		return this.isYou == isYou;
	}
}
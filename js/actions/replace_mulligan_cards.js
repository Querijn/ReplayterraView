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
	static settle() {
		this.settleCount++;
		if (this.settleCount == 2) {
			Replay.players[0].mulliganView.moveToHand();
			Replay.players[1].mulliganView.moveToHand();
			this.timeSettled = performance.now();
		}
	}

	play() {
		console.log(`${performance.now()}: Playing ${this.name}: ${this.oldCards.length} cards will be replaced for ${this.isYou ? "you" : "them"}`)
		const player = Replay.players[this.isYou ? 0 : 1];
		
		let pos = 0;
		for (const cardInfo of this.oldCards) {
			const cardIndex = player.mulliganView.cards.findIndex((c) => c.id == c.id);
			if (cardIndex < 0)
				throw new Error(`Could not find card by ID ${cardInfo.id}`);

			const card = player.mulliganView.cards.splice(cardIndex, 1)[0];
			player.deck.addToBottom(card).onDone(() => {
				player.deck.drawToMulliganView(cardIndex + pos++).onDone(() => {

					card.addAnimation()
					.add(new AnimationDelay(2000))
					.onDone(() => { 
						ReplaceMulliganCardsAction.settle();
					});
				});
			});
		}
	}

	get deckCardData() {
		return this.newCards;
	}
}
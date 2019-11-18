import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import CardData from "../card_data.js";
import AnimationDelay from "../animation_delay.js";

export default class ReplaceMulliganCardsAction extends BaseAction {

	oldCards = [];
	newCards = [];

	constructor(isYou, oldCards, newCards) {
		super("ReplaceMulliganCards");

		this.isYou = isYou;
		for (const cardInfo of oldCards)
			this.oldCards.push(new CardData(cardInfo.id, cardInfo.code));
		
		for (const cardInfo of newCards)
			this.newCards.push(new CardData(cardInfo.id, cardInfo.code));
	}
	
	isReadyToPlay(timeMs) {
		if (Replay.timeMulliganResolved < 0)
			return false;

		return timeMs - Replay.timeMulliganResolved > 2000;
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
					.add(new AnimationDelay(4000))
					.onDone(() => { 
						player.mulliganView.moveToHand();
					});
				});
			});
		}
	}

	get deckCardData() {
		return this.newCards;
	}
}
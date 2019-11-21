import Replay from "./replay.js";
import CardContainer from "./card_container.js";

export default class Deck extends CardContainer {

	constructor(player, x, y) {
		super("deck", player, x, y, 0.01, false);
	}

	prepare() {
		
		// At this point, all the actions are ordered.
		// TODO: Delete all cards, start over with new ones in current positions.
		this.cards = [];
		console.log(`Preparing deck..`);

		for (const action of Replay.actions) {
			const cards = action.deckCardData;
			
			if (action.isYou != !this.player.isTop)
				continue;
				
			for (const card of cards) {
				this.addCardsToBottom([card], true);
			}
		}

		console.log(`${!this.player.isTop ? "Player" : "Opponent"}'s deck currently looks like this: `, this.cards.map(c => c.data ));
	}
	
	fixPositions(skipAnimations, card) {
		card.moveTo(this.x, this.y, 0, skipAnimations ? 0 : 250);
	}
}
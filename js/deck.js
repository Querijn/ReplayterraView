import Replay from "./replay.js";
import CardContainer from "./card_container.js";

export default class Deck extends CardContainer {

	constructor(player, x, y) {
		super(player, x, y);
	}

	prepare() {
		
		// At this point, all the actions are ordered.
		// TODO: Delete all cards, start over with new ones in current positions.
		this.cards = [];
		debug.log(`Preparing deck..`);

		for (const action of Replay.actions) {
			const cards = action.deckCardData;
			
			if (!action.isPlayerAction(!this.player.isTop))
				continue;
				
			for (const card of cards) {
				this.addToBottom(card, true);
				debug.log(`- Adding card ${card.code}/${card.id || "(no id)"} to ${!this.player.isTop ? "player" : "opponent"} deck.`);
			}
		}

		debug.log(`${!this.player.isTop ? "player" : "opponent"}'s deck currently looks like this: `, this.cards.map(c => c.data ));
	}

	drawCard() {
		return this.cards.pop();
	}
}
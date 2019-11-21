import CardContainer from "./card_container.js";
import Deck from "./deck.js";

export default class PlayerSide {

	constructor (isTop) {
		this.isTop = isTop;

		const resX = 800; // TODO: 
		const resY = 600;

		const deckX = isTop ? resX - 50 : 50;
		const deckY = isTop ? 50 :	resY - 50;
		const deckScale = 1.2;
		this.deck = new Deck(this, deckX, deckY);
		
		const mullX = resX / 2;
		const mullY = resY / 4 * (isTop ? 1 : 3);
		const mullWidth = 0.5;
		const mullScale = 2.0;
		this.mulligan = new CardContainer("mulligan", this, mullX, mullY, mullScale, mullWidth, true, CardContainer.ShowSide.NoPreference);

		const handX = resX / 2;
		const handY = isTop ? 0 : resY;
		const handWidth = 0.3;
		const handScale = 1.0;
		this.hand = new CardContainer("hand", this, handX, handY, handScale, handWidth, true, CardContainer.ShowSide.ShowFront);

		const benchX = resX / 2;
		const benchY = isTop ? 100 : resY - 100;
		const benchWidth = 0.5;
		const benchScale = 1.0;
		this.bench = new CardContainer("bench", this, benchX, benchY, benchScale, benchWidth, true, CardContainer.ShowSide.ShowFront);

		const fieldX = resX / 2;
		const fieldY = isTop ? 225 : resY - 225;
		const fieldWidth = 0.5;
		const fieldScale = 1.0;
		this.field = new CardContainer("field", this, fieldX, fieldY, fieldScale, fieldWidth, true, CardContainer.ShowSide.ShowFront);
		
		// console.log(`${isTop ? "Top" : "Bottom"} player's deck is at ${deckX}, ${deckY}.`);
		// console.log(`${isTop ? "Top" : "Bottom"} player's mulligan is at ${mullX}, ${mullY}.`);
		// console.log(`${isTop ? "Top" : "Bottom"} player's hand is at ${handX}, ${handY}.`);
		// console.log(`${isTop ? "Top" : "Bottom"} player's bench is at ${benchX}, ${benchY}.`);
		// console.log(`${isTop ? "Top" : "Bottom"} player's field is at ${fieldX}, ${fieldY}.`);
	}

	findCard(cardId) {
		const containers = [
			this.deck,
			this.hand,
			this.bench,
			this.field,
			this.mulligan
		];

		for (const container of containers) {
			let card = container.cards.find(c => c.id == cardId);
			if (card) 
				return [ container, card ];
		}

		return [ null, null ];
	}
}
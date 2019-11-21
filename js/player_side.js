import CardContainer from "./card_container.js";
import Deck from "./deck.js";

export default class PlayerSide {

	constructor (isTop) {
		this.isTop = isTop;

		const resX = 800; // TODO: 
		const resY = 600;

		const deckX = isTop ? resX - 50 : 50;
		const deckY = isTop ? 50 :	resY - 50;
		this.deck = new Deck(this, deckX, deckY);
		
		const mullX = resX / 2;
		const mullY = resY / 4 * (isTop ? 1 : 3);
		const mullWidth = 0.5;
		this.mulligan = new CardContainer("mulligan", this, mullX, mullY, mullWidth, true, CardContainer.ShowSide.NoPreference);

		const handX = resX / 2;
		const handY = isTop ? 0 : resY;
		const handWidth = 0.3;
		this.hand = new CardContainer("hand", this, handX, handY, handWidth, true, CardContainer.ShowSide.ShowFront);

		const benchX = resX / 2;
		const benchY = isTop ? 100 : resY - 100;
		const benchWidth = 0.5;
		this.bench = new CardContainer("bench", this, benchX, benchY, benchWidth, true, CardContainer.ShowSide.ShowFront);

		const fieldX = resX / 2;
		const fieldY = isTop ? 200 : resY - 200;
		const fieldWidth = 0.5;
		this.field = new CardContainer("field", this, fieldX, fieldY, fieldWidth, true, CardContainer.ShowSide.ShowFront);
		
		// debug.log(`${isTop ? "Top" : "Bottom"} player's deck is at ${deckX}, ${deckY}.`);
		// debug.log(`${isTop ? "Top" : "Bottom"} player's mulligan is at ${mullX}, ${mullY}.`);
		// debug.log(`${isTop ? "Top" : "Bottom"} player's hand is at ${handX}, ${handY}.`);
		// debug.log(`${isTop ? "Top" : "Bottom"} player's bench is at ${benchX}, ${benchY}.`);
		// debug.log(`${isTop ? "Top" : "Bottom"} player's field is at ${fieldX}, ${fieldY}.`);
	}
}
import CardContainer from "./card_container.js";
import Deck from "./deck.js";
import Scene from "./scene.js";

export default class PlayerSide {

	constructor (isTop) {
		this.isTop = isTop;

		const resX = 800; // TODO: 
		const resY = 600;

		const extraScale = Scene.width / 800; // I'm expecting this resolution. If it's any different, scale the stuff up.

		
		const toCorrectResX = (oldX) => (oldX / 800) * Scene.width;
		const toCorrectResY = (oldY) => (oldY / 600) * Scene.height;
		
		const deckX = isTop ? resX - 50 : 50;
		const deckY = isTop ? 75 :	resY - 50;
		const deckScale = 1.5 * extraScale;
		this.deck = new Deck(this, toCorrectResX(deckX), toCorrectResY(deckY), deckScale);
		
		const mullX = resX / 2;
		const mullY = resY / 4 * (isTop ? 1 : 3);
		const mullWidth = 0.5;
		const mullScale = 2.0 * extraScale;
		this.mulligan = new CardContainer("mulligan", this, toCorrectResX(mullX), toCorrectResY(mullY), mullScale, mullWidth, true, CardContainer.ShowSide.NoPreference);

		const handX = resX / 2;
		const handY = isTop ? 0 : resY;
		const handWidth = 0.3;
		const handScale = 1.0 * extraScale;
		this.hand = new CardContainer("hand", this, toCorrectResX(handX), toCorrectResY(handY), handScale, handWidth, true, CardContainer.ShowSide.ShowFront);

		const benchX = resX / 2;
		const benchY = isTop ? 100 : resY - 100;
		const benchWidth = 0.5;
		const benchScale = 1.0 * extraScale;
		this.bench = new CardContainer("bench", this, toCorrectResX(benchX), toCorrectResY(benchY), benchScale, benchWidth, true, CardContainer.ShowSide.ShowFront);

		const fieldX = resX / 2;
		const fieldY = isTop ? 225 : resY - 225;
		const fieldWidth = 0.5;
		const fieldScale = 1.4 * extraScale;
		this.field = new CardContainer("field", this, toCorrectResX(fieldX), toCorrectResY(fieldY), fieldScale, fieldWidth, true, CardContainer.ShowSide.ShowFront);
		
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
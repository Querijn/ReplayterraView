import MulliganView from "./mulligan.js";
import DeckView from "./deck.js";

export default class PlayerSide {

	constructor (isTop) {
		this.isTop = isTop;

		const resX = 800;
		const resY = 600;

		const deckX = isTop ? resX - 50 : 50;
		const deckY = isTop ? 50 :	resY - 50;
		this.deck = new DeckView(this, deckX, deckY);
		
		const mullX = resX / 2;
		const mullY = resY / 4 * (isTop ? 1 : 3);
		console.log(`${isTop ? "Top" : "Bottom"} player's deck is at ${deckX}, ${deckY}.`);
		console.log(`${isTop ? "Top" : "Bottom"} player's mulligan is at ${mullX}, ${mullY}.`);
		this.mulliganView = new MulliganView(this, mullX, mullY);
	}
}
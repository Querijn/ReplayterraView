import MulliganView from "./mulligan.js";
import DeckView from "./deck.js";
import Hand from "./hand.js";

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
		this.mulliganView = new MulliganView(this, mullX, mullY);

		const handX = resX / 2;
		const handY = isTop ? 0 : resY;
		this.hand = new Hand(this, handX, handY);
		
		console.log(`${isTop ? "Top" : "Bottom"} player's deck is at ${deckX}, ${deckY}.`);
		console.log(`${isTop ? "Top" : "Bottom"} player's mulligan is at ${mullX}, ${mullY}.`);
		console.log(`${isTop ? "Top" : "Bottom"} player's hand is at ${handX}, ${handY}.`);
	}
}
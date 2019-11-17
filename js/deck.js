import Replay from "./replay.js";
import Card from "./card.js";

export default class Deck {

	cards = [];

	constructor(player, x, y) {

		this.player = player;
		this._x = x;
		this._y = y;
	}

	addToTop(cardData) {
		const card = cardData.isRenderObject ? cardData : new Card(cardData.id, cardData.code, !this.player.isTop);
		this.cards.push(card);

		card.rotation.z = this.player.isTop ? 0 : Math.PI + (Math.random() - 0.5) * 10 * (Math.PI/180);
		card.moveTo(this.x, this.y, 0, false);
	}

	prepare() {
		
		// At this point, all the actions are ordered.
		// TODO: Delete all cards, start over with new ones in current positions.

		for (const action of Replay.actions) {
			const cards = action.relatedCardData;
			
			for (const card of cards) {
				this.addToTop(card);
			}
		}
	}

	drawToMulliganView() {
		const movingCards = this.cards.splice(0, 4);
		this.player.mulliganView.addCards(movingCards);
	}

	get x() { return this._x; }
	get y() { return this._y; }
}
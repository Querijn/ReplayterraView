import Card from "./card.js";

export default class Mulligan {

	cards = [];

	constructor(player, x, y) {

		this.player = player;
		this._x = x;
		this._y = y;
	}

	addCards(cards) {

		const width = 400; // TODO: Make variable
		if (!cards || cards.length == 0)
			return;

		const left = this.x - width / 2 + cards[0].width / 2;
		for (let i = 0; i < 4; i++) {
			const card = cards[i];
			this.cards.push(card);	
			card.moveTo(left + (width / 4) * i, this.y, 250 * (i + 1));
		}
	}

	get x() { return this._x; }
	get y() { return this._y; }
}
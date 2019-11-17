import Card from "./card.js";

export default class Mulligan {

	cards = [];

	constructor(player, x, y) {

		this.player = player;
		this._x = x;
		this._y = y;
	}

	addCards(cards) {

		const width = 300; // TODO: Make variable
		if (!cards || cards.length == 0)
			return;

		const left = this.x - width / 2.733; // TODO: This is now completely wrong but whatever.
		for (let i = 0; i < 4; i++) {
			const card = cards[i];
			this.cards.push(card);	
			const anim = card.moveTo(left + (width / 4) * i, this.y, 250 * (i + 1)) // Move to mulligan position.
			
			if (!this.player.isTop) // Flip if bottom player
				anim.onDone((anim) => { card.flip() });
		}
	}

	get x() { return this._x; }
	get y() { return this._y; }
}
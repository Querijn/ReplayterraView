import * as Easing from "./easing.js";
import AnimationEffect from "./animation_effect.js";
import AnimationDelay from "./animation_delay.js";

export default class Bench {

	cards = [];

	constructor(player, x, y) {

		this.player = player;
		this._x = x;
		this._y = y;
	}

	addCards(cards) {
		this.cards.push(...cards);

		this.fixPositions();
	}

	addCard(card) {
		this.cards.push(card);

		this.fixPositions();
	}

	fixPositions() {
		const width = 400;
		const left = this.x - width / 2.733; // TODO: This is now completely wrong but whatever.

		let anim = null;
		for (let i = 0; i < this.cards.length; i++) {
			const card = this.cards[i];
			
			const destX = left + (width / this.cards.length - 1) * i;
			const destY = this.y;
			const moveDuration = 120;
			anim = card.moveTo( // Move to hand position.
				destX,				// x
				destY,				// y
				3 + i,				// z
				moveDuration		// move duration
			);

			card.addAnimation()
			.add(new AnimationEffect(Easing.easeOutCubic, card, "scale", 1.5, moveDuration));
		}
		
		return anim;
	}

	get x() { return this._x; }
	get y() { return this._y; }
}
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

	addCards(cards, skipAnimations) {
		this.cards.push(...cards);

		this.fixPositions(skipAnimations);
	}

	addCard(card, skipAnimations) {
		this.cards.push(card);

		this.fixPositions(skipAnimations);
	}

	fixPositions(skipAnimations) {
		const width = 400;
		const left = this.x - width / 2; // TODO: This is now completely wrong but whatever.

		let anim = null;
		for (let i = 0; i < this.cards.length; i++) {
			const card = this.cards[i];
			
			const destX = left + (width / (this.cards.length + 1)) * (i + 1);
			const destY = this.y;
			const moveDuration = skipAnimations ? 0 : 120;
			anim = card.moveTo( // Move to hand position.
				destX,				// x
				destY,				// y
				0,					// z
				moveDuration		// move duration
			);

			if (skipAnimations) {
				card.scale = 1.5;
			}
			else {
				card.addAnimation()
				.add(new AnimationEffect(Easing.easeOutCubic, card, "scale", 1.5, moveDuration));	
			}
		}
		
		return anim;
	}

	get x() { return this._x; }
	get y() { return this._y; }
}
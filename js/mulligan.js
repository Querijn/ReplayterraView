import * as Easing from "./easing.js";
import AnimationEffect from "./animation_effect.js";
import AnimationDelay from "./animation_delay.js";

export default class Mulligan {

	cards = [];
	cardsShown = 0;
	resolveTime = -1;

	constructor(player, x, y) {

		this.player = player;
		this._x = x;
		this._y = y;
	}

	addCards(cards, pos) {

		const width = 300; // TODO: Make variable
		if (!cards || cards.length == 0)
			return;

		const finalResolve = () => {
			this.cardsShown++;
			if (this.cardsShown === 4)
				this.resolveTime = performance.now();
		};

		const left = this.x - width / 2.733; // TODO: This is now completely wrong but whatever.
		for (let i = 0; i < cards.length; i++) {

			const index = pos != null ? pos : i;

			const card = cards[i];
			this.cards.push(card);	
			const anim = card.moveTo( // Move to mulligan position.
				left + (width / 4) * index,		// x
				this.y, 						// y
				3, 								// z
				250 * (index + 1)					// move duration
			);
			
			const delay = 300;
			const duration = 500;

			if (!this.player.isTop) { // Flip if bottom player
				anim.onDone((anim) => { 
					card.flip(delay, duration).onDone(finalResolve); 

					card.addAnimation()
					.add(new AnimationDelay(delay))
					.add(new AnimationEffect(Easing.easeInOutQuad, card, "scale", 1.6, 2 * duration))
					.add(new AnimationEffect(Easing.easeOutQuad, card, "scale", 1.2, 2 * duration));
				});
			}
			else {
				anim
				.add(new AnimationDelay(delay + duration))
				.onDone(finalResolve);
			}
		}
	}

	get x() { return this._x; }
	get y() { return this._y; }
}
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

		const width = 600; // TODO: Make variable
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
			
			card.addAnimation()
			.add(new AnimationEffect(Easing.easeInOutQuad, card, "scale", 2.6, anim.length));
			
			const delay = 300;
			const duration = 500;

			if (!this.player.isTop) { // Flip if bottom player
				anim.onDone((anim) => { 
					card.flip(delay, duration).onDone(finalResolve); 

					card.addAnimation()
					.add(new AnimationDelay(delay))
					.add(new AnimationEffect(Easing.easeInOutQuad, card, "scale", 3.6, duration / 2))
					.add(new AnimationEffect(Easing.easeOutQuad, card, "scale", 2.6, duration / 2));
					
					card.addAnimation()
					.add(new AnimationDelay(delay))
					.add(new AnimationEffect(Easing.easeInOutQuad, card, "z", 5, duration / 2))
					.add(new AnimationEffect(Easing.easeInOutQuad, card, "z", 3, duration / 2))
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
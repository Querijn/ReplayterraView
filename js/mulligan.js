import * as Easing from "./easing.js";
import AnimationEffect from "./animation_effect.js";
import AnimationDelay from "./animation_delay.js";
import CardAnimation from "./animation.js";

export default class Mulligan {

	cards = [];
	cardsShown = 0;
	resolveTime = -1;

	constructor(player, x, y) {

		this.player = player;
		this._x = x;
		this._y = y;
	}

	addCards(cards, pos, skipAnimations) {

		const width = 600; // TODO: Make variable
		if (!cards || cards.length == 0) {
			throw new Error("Unexpected empty card array given to mulligan!");
			return new CardAnimation();
		}

		const finalResolve = () => {
			this.cardsShown++;
			if (this.cardsShown === 4)
				this.resolveTime = performance.now();
		};

		let anim = null;
		const left = this.x - width / 2.733; // TODO: This is now completely wrong but whatever.
		for (let i = 0; i < cards.length; i++) {

			const index = pos != null ? pos : i;

			const card = cards[i];
			this.cards.push(card);
			const moveDuration = skipAnimations ? 0 : 250 * (index + 1);
			anim = card.moveTo( // Move to mulligan position.
				left + (width / 4) * index,		// x
				this.y, 						// y
				3, 								// z
				moveDuration					// move duration
			);
			
			if (skipAnimations) {
				card.scale = 2.6;
			}
			else {
				card.addAnimation()
				.add(new AnimationEffect(Easing.easeInOutQuad, card, "scale", 2.6, anim.length));
			}
			
			const delay = skipAnimations ? 0 : 300;
			const duration = skipAnimations ? 0 : 500;

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

		return anim;
	}

	moveToHand(skipAnimations) {
		const cards = this.cards.sort((c1, c2) => c1.position.x - c2.position.x);
		this.cards = [];

		console.log(`Moving ${this.cards.length} cards to hand from mulligan.${skipAnimations ? " (no anims)" : ""}`);

		this.player.hand.addCards(cards, skipAnimations);
	}

	get x() { return this._x; }
	get y() { return this._y; }
}
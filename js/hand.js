import * as Easing from "./easing.js";
import AnimationEffect from "./animation_effect.js";
import AnimationDelay from "./animation_delay.js";

export default class Hand {

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

		const rotOffset = 60
		const width = 300;
		const left = this.x - width / 2.733; // TODO: This is now completely wrong but whatever.

		const botRotBase = !this.player.isTop ? Math.PI : 0;					// Bottom cards are not upside down
		const leftRot = botRotBase + rotOffset * 0.5 * Math.PI / 180; 			// Most left rotation (i = 0)
		const rotStep = (-rotOffset * Math.PI / 180) / (this.cards.length - 1); // How many degrees to add per i

		let anim = null;
		for (let i = 0; i < this.cards.length; i++) {
			const card = this.cards[i];
			
			const destX = left + (width / this.cards.length - 1) * i;

			const distFromMid = (Math.abs(destX - this.x) / (width * 0.5));

			const topY = this.player.isTop ? -1 : 1;
			const destY = this.y + topY * distFromMid * 40; // Based on distance from middle, move down 0~40 pixels.
			const moveDuration = 120;
			anim = card.moveTo( // Move to hand position.
				destX,				// x
				destY,				// y
				3 + i,				// z
				moveDuration		// move duration
			);

			// Rotate slightly based on i
			card.addAnimation()
			.add(new AnimationEffect(Easing.easeOutCubic, card.rotation, "z", leftRot + rotStep * i, moveDuration));

			card.addAnimation()
			.add(new AnimationEffect(Easing.easeOutCubic, card, "scale", 2.0, moveDuration));
		}
		
		return anim;
	}

	addCardToBench(cardData) {
		const cardIndex = this.cards.findIndex((c) => cardData.id == c.id);
		if (cardIndex < 0)
			throw new Error(`The hand can't move card ${cardData.id} to the bench because the bench does not have it!`);

		const card = this.cards.splice(0, 1)[0];
		this.player.bench.addCard(card);
	}

	get x() { return this._x; }
	get y() { return this._y; }
}
import Replay from "./replay.js";
import Card from "./card.js";
import * as Easing from "./easing.js";
import AnimationEffect from "./animation_effect.js";
import AnimationDelay from "./animation_delay.js";

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

		card.rotation.z = (this.player.isTop ? 0 : Math.PI) + (Math.random() - 0.5) * 20 * (Math.PI/180);
		return card.moveTo(this.x, this.y, this.cards.length, 0, false);
	}

	addToBottom(cardData, skipAnimations) {
		const card = cardData.isRenderObject ? cardData : new Card(cardData.id, cardData.code, !this.player.isTop);
		this.cards.unshift(card);

		const delay = skipAnimations ? 0 : 300;
		const duration = skipAnimations ? 0 : 500;
		const anim = card.showBack(delay, duration);
		if (anim.length == 0) {
			anim.add(new AnimationDelay(delay + duration));
		}

		return anim.onDone(() => {
			const moveDuration = skipAnimations ? 0 : 120;
			const rotate = this.player.isTop ? 0 : Math.PI + (Math.random() - 0.5) * 20 * (Math.PI/180);
			card.addAnimation()
			.add(new AnimationEffect(Easing.easeInOutQuad, card.rotation, "z", rotate, moveDuration)); 
			card.moveTo(this.x, this.y, 0, moveDuration, false, true);
		});
	}

	prepare() {
		
		// At this point, all the actions are ordered.
		// TODO: Delete all cards, start over with new ones in current positions.
		this.cards = [];
		debug.log(`Preparing deck..`);

		for (const action of Replay.actions) {
			const cards = action.deckCardData;
			
			if (!action.isPlayerAction(!this.player.isTop))
				continue;
				
			for (const card of cards) {
				this.addToTop(card);
				debug.log(`- Adding card ${card.id} to ${!this.player.isTop ? "player" : "opponent"} deck.`);
			}
		}
	}

	drawToMulliganView(cardIndex = null, skipAnimations = false) {
		const movingCards = cardIndex === null ? this.cards.splice(0, 4) : this.cards.splice(0, 1);
		return this.player.mulliganView.addCards(movingCards, cardIndex, skipAnimations);
	}

	drawToHand(skipAnimations) {

		const card = this.cards.splice(0, 1)[0]; // Take top card
		if (skipAnimations) {
			this.player.hand.addCard(card, skipAnimations);
			return;
		}


		// Present the card if we're the player.
		if (!this.player.isTop) {
			card.moveTo(400, 300, 10, 300).onDone(() => {
				card.showFront();

				card.addAnimation()
				.add(new AnimationDelay(1000))
				.onDone(() => this.player.hand.addCard(card));
			});
			
			card.addAnimation()
			.add(new AnimationEffect(Easing.easeOutQuint, card, "scale", 4.0, 300));
		}
		else {
			this.player.hand.addCard(card);
		}
	}

	get x() { return this._x; }
	get y() { return this._y; }
}
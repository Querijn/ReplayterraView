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

	addToBottom(cardData) {
		const card = cardData.isRenderObject ? cardData : new Card(cardData.id, cardData.code, !this.player.isTop);
		this.cards.push(card);

		const anim = card.showBack(300, 500);
		if (anim.length == 0) {
			anim.add(new AnimationDelay(800));
		}

		return anim.onDone(() => {
			card.addAnimation()
			.add(new AnimationEffect(Easing.easeInOutQuad, card.rotation, "z", this.player.isTop ? 0 : Math.PI + (Math.random() - 0.5) * 20 * (Math.PI/180), 120)); 
			card.moveTo(this.x, this.y, 0, 120, false, true);
		});
	}

	prepare() {
		
		// At this point, all the actions are ordered.
		// TODO: Delete all cards, start over with new ones in current positions.

		for (const action of Replay.actions) {
			const cards = action.deckCardData;
			
			if (!action.isPlayerAction(!this.player.isTop))
				continue;
				
			for (const card of cards) {
				this.addToTop(card);
			}
		}
	}

	drawToMulliganView(cardIndex = null) {
		const movingCards = cardIndex === null ? this.cards.splice(0, 4) : this.cards.splice(cardIndex, 1);
		return this.player.mulliganView.addCards(movingCards, cardIndex);
	}

	drawToHand() {
		const card = this.cards.splice(0, 1)[0]; // Take top card

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
import Card from "./card.js";
import Scene from "./scene.js";
import AnimationEffect from "./animation/animation_effect.js";
import * as Easing from "./easing.js";

export default class CardContainer {

	static ShowSide = {
		NoPreference: 0,
		ShowFront: 1,
		ShowBack: 2
	};

	cards = [];
	constructor (name, player, x, y, scale = 1.0, width = 0.5, shouldAddToTop = true, showSide = CardContainer.ShowSide.NoPreference) {
		
		this.name = name;
		this._player = player;
		this._x = x;
		this._y = y;
		this.scale = scale;
		this.width = width;
		this.shouldAddToTop = shouldAddToTop;
		this.showSide = showSide;
	}

	addCardsToBottom(cards, skipAnimations) {

		let lastAnim = null;
		for (let card of cards) {
			if (!card.isRenderObject)
				card = new Card(card, !this._player.isTop);

			const moveDuration = skipAnimations ? 0 : 250;
			const playerName = this.player.isTop ? "opponent's" : "your";
			console.log (`Adding card ${card.id} to top of ${playerName} ${this.name} ${skipAnimations ? "immediately." : `in ${moveDuration}ms`}.`);

			this.cards.unshift(card);
			lastAnim = this.fixPositions(skipAnimations, card);
		}
		
		return lastAnim;
	}

	addCardsToTop(cards, skipAnimations) {

		let lastAnim = null;
		for (let card of cards) {
			if (!card.isRenderObject)
				card = new Card(card, !this._player.isTop);

			const moveDuration = skipAnimations ? 0 : 250;
			const playerName = this.player.isTop ? "opponent's" : "your";
			console.log (`Adding card ${card.id} to bottom of ${playerName} ${this.name} ${skipAnimations ? "immediately." : `in ${moveDuration}ms`}.`);

			this.cards.push(card);
			lastAnim = this.fixPositions(skipAnimations, card); // This will move the card towards the container too.
		}
		
		return lastAnim;
	}

	addAtIndex(card, index, skipAnimations) {

		if (!card.isRenderObject) { // If card data
			card = new Card(card, !this._player.isTop);
		}

		else { // If we already had this card
			const existing = this.cards.findIndex(c => c === card);
			if (existing >= 0) // Remove it to avoid dupes
				this.card.splice(existing, 1);
		}

		const moveDuration = skipAnimations ? 0 : 250;
		const playerName = this.player.isTop ? "opponent's" : "your";
		console.log (`Adding card ${card.id} to index ${index} of ${playerName} ${this.name} ${skipAnimations ? "immediately." : `in ${moveDuration}ms`}.`);

		this.cards.splice(index, 0, card);
		return this.fixPositions(skipAnimations, card); // This will move the card towards the container too.
	}

	drawFromTop(cardContainer, skipAnimations) {
		const card = this.cards.length > 0 ? this.cards[this.cards.length - 1] : null;
		if (!card)
			throw new Error(`${!this.player.isTop ? "Player" : "Opponent"}'s ${this.name}: Cannot draw from the top of an empty container!`);

		return this.moveToContainer(card, cardContainer, skipAnimations);
	}

	moveToContainer(card, cardContainer, skipAnimations) {

		const cardIndex = this.cards.findIndex(c => c.id == card.id);
		if (cardIndex < 0)
			throw new Error(`moveToContainer: Could not find ${card.id} in ${!this.player.isTop ? "player" : "opponent"}'s ${this.name}!`);

		card = this.cards.splice(cardIndex, 1)[0];
		console.log(`${!this.player.isTop ? "Player" : "Opponent"}'s ${this.name} is moving a card to ${cardContainer.name}'s ${cardContainer.shouldAddToTop ? "top" : "bottom"} (${skipAnimations ? "skipping anims" : "with anims"})`);

		this.fixPositions(skipAnimations, card);
		if (cardContainer.shouldAddToTop)
			return cardContainer.addCardsToTop([card], skipAnimations);
		else
			return cardContainer.addCardsToBottom([card], skipAnimations);
	}

	moveAllToContainer(cardContainer, skipAnimations) {

		const cards = this.cards;
		this.cards = [];

		console.log(`${!this.player.isTop ? "Player" : "Opponent"}'s ${this.name} is moving all its cards to ${cardContainer.name}'s ${cardContainer.shouldAddToTop ? "top" : "bottom"} (${skipAnimations ? "skipping anims" : "with anims"})`);

		if (cardContainer.shouldAddToTop)
			return cardContainer.addCardsToTop(cards, skipAnimations);
		else
			return cardContainer.addCardsToBottom(cards, skipAnimations);
	}

	fixPositions(skipAnimations, card) {

		const width = this.width * Scene.width;
		const stepX = width / (this.cards.length || 1);

		let lastAnim = null;
		for (let i = 0; i < this.cards.length; i++) {

			const card = this.cards[i];
			let distFromMiddleIndex = this.cards.length > 1 ? (this.cards.length - 1) / 2 - i : 0;

			switch (this.showSide) {
				case CardContainer.ShowSide.ShowFront:
					card.showFront(0, skipAnimations ? 0 : 250);
					break;

				case CardContainer.ShowSide.ShowBack:
					card.ShowBack(0, skipAnimations ? 0 : 250);
					break;
			}

			card.addAnimation()
			.add(new AnimationEffect(Easing.easeInOutQuad, card, "scale", this.scale, skipAnimations ? 0 : 250));

			lastAnim = card.moveTo(
				this.x + distFromMiddleIndex * stepX,
				this.y,
				i,
				skipAnimations ? 0 : 250
			);
		}
		return lastAnim;
	}

	destroyCard(card, skipAnimations) {

		const i = this.cards.findIndex(c => c === card);
		if (i < 0)
			throw new Error("Cannot find this card in this container!");

		this.cards.splice(i, 1); // Single out card
		return card.destroy(skipAnimations);
	}

	pruneDummies() {
		const oldSize = this.cards.length;
		this.cards = this.cards.filter(c => !c.isDummy);

		// if (oldSize == this.cards.length)
		// 	return null;
		// return this.fixPositions();
	}

	get x() { return this._x; }
	get y() { return this._y; }

	get player() { return this._player; }
}
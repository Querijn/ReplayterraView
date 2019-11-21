import Card from "./card.js";
import Scene from "./scene.js";
import Animation from "./animation/animation.js";

export default class CardContainer {

	cards = [];
	constructor (name, player, x, y, width = 0.5, shouldAddToTop = true) {
		
		this.name = name;
		this._player = player;
		this._x = x;
		this._y = y;
		this.width = width;
		this.shouldAddToTop = shouldAddToTop;
	}

	addCardsToBottom(cards, skipAnimations) {

		let lastAnim = new Animation(null);
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

		let lastAnim = new Animation(null);
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
		debug.log(`${!this.player.isTop ? "Player" : "Opponent"}'s ${this.name} is moving a card to ${cardContainer.name}'s ${cardContainer.shouldAddToTop ? "top" : "bottom"} (${skipAnimations ? "skipping anims" : "with anims"})`);

		this.fixPositions(skipAnimations, card);
		if (cardContainer.shouldAddToTop)
			return cardContainer.addCardsToTop([card], skipAnimations);
		else
			return cardContainer.addCardsToBottom([card], skipAnimations);
	}

	moveAllToContainer(cardContainer, skipAnimations) {

		const cards = this.cards;
		this.cards = [];

		debug.log(`${!this.player.isTop ? "Player" : "Opponent"}'s ${this.name} is moving all its cards to ${cardContainer.name}'s ${cardContainer.shouldAddToTop ? "top" : "bottom"} (${skipAnimations ? "skipping anims" : "with anims"})`);

		if (cardContainer.shouldAddToTop)
			return cardContainer.addCardsToTop(cards, skipAnimations);
		else
			return cardContainer.addCardsToBottom(cards, skipAnimations);
	}

	fixPositions(skipAnimations, card) {

		const width = this.width * Scene.width;
		const stepX = width / (this.cards.length || 1);

		let lastAnim = new Animation(null);
		for (let i = 0; i < this.cards.length; i++) {

			const card = this.cards[i];
			let distFromMiddleIndex = this.cards.length > 1 ? (this.cards.length - 1) / 2 - i : 0;

			lastAnim = card.moveTo(
				this.x + distFromMiddleIndex * stepX,
				this.y,
				i,
				skipAnimations ? 0 : 250
			);
		}
		return lastAnim;
	}

	get x() { return this._x; }
	get y() { return this._y; }

	get player() { return this._player; }
}
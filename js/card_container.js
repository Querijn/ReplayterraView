import Card from "./card.js";
import Scene from "./scene.js";

export default class CardContainer {

	cards = [];
	constructor (name, player, x, y, width = 0.5, showingFront = true) {
		
		this.name = name;
		this._player = player;
		this._x = x;
		this._y = y;
		this.width = width;
	}

	addToBottom(card, skipAnimations) {
		if (!card.isRenderObject)
			card = new Card(card, !this._player.isTop);

		const moveDuration = skipAnimations ? 0 : 250;
		const playerName = this.player.isTop ? "opponent's" : "your";
		console.log (`Adding card ${card.id} to top of ${playerName} ${this.name} ${skipAnimations ? "immediately." : `in ${moveDuration}ms`}.`);

		this.cards.unshift(card);
		return card.moveTo(this.x, this.y, 0, moveDuration);
	}

	addToTop(card, skipAnimations) {
		if (!card.isRenderObject)
			card = new Card(card, !this._player.isTop);

		const moveDuration = skipAnimations ? 0 : 250;
		const playerName = this.player.isTop ? "opponent's" : "your";
		console.log (`Adding card ${card.id} to bottom of ${playerName} ${this.name} ${skipAnimations ? "immediately." : `in ${moveDuration}ms`}.`);

		this.cards.push(card);
		return this.fixPositions(skipAnimations); // This will move the card towards the container too.
	}

	fixPositions(skipAnimations) {

		const width = this.width * Scene.width;
		const stepX = width / (this.cards.length || 1);

		let lastAnim = new Animation(null);
		for (let i = 0; i < this.cards.length; i++) {

			const card = this.cards[i];
			const distFromMiddleIndex = this.cards.length > 1 ? this.cards.length / 2 - i : 0;

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
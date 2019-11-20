export default class CardContainer {

	constructor (player, x, y) {
		
		this._player = player;
		this._x = x;
		this._y = y;
	}

	addToBottom(card, skipAnimations) {
		this.cards.unshift(card);
	}

	addToTop(card, skipAnimations) {
		this.cards.push(card);
		
		card.moveTo(x, y, z, )
	}

	get x() {
		return this._x;
	}
	
	get y() {
		return this._y;
	}
}
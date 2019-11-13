import * as PIXI from "pixi.js";
import GameBoard from "../game_board";
export default class Button {
	constructor(imgFile, x, y, onDown, onUp) {
		var textureButton = PIXI.Texture.from(imgFile);

		this.onDown = onDown;
		this.onUp = onUp;

		this.sprite = new PIXI.Sprite(textureButton);

		this.x = x;
		this.y = y;

		this.sprite.buttonMode = true;
		this.sprite.interactive = true;
		this.sprite
		.on('mousedown', this._downHandler.bind(this))
		.on('touchstart', this._downHandler.bind(this))
		.on('mouseup', this._upHandler.bind(this))
		.on('touchend', this._upHandler.bind(this))
		.on('mouseupoutside', this._upHandler.bind(this))
		.on('touchendoutside', this._upHandler.bind(this))

		GameBoard.app.stage.addChild(this.sprite);
	}

	_downHandler() {
		this.isDown = true;

		if (this.onDown)
			this.onDown();
	}

	_upHandler() {
		this.isDown = false;

		if (this.onUp)
			this.onUp();
	}
}
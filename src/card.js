import * as PIXI from "pixi.js";
import GameBoard from "./game_board";

export default class Card {

	constructor(cardData, id) {
		this.cardData = JSON.parse(cardData);
		this.id = id;

		this.startX = 0;
		this.startY = 0;
		this.targetX = 0;
		this.targetY = 0;

		this.moveTimer = 1;
		this.addTimer = 1;
		this.removeTimer = 1;

		this.startScale = 1;
		this.targetScale = 1;

		console.log(`New card initialised: ID: ${id}`);
	}

	add(x, y, scale) {

		y = 1080 - y;

		this.texture = PIXI.Texture.from(`assets/en_us/img/cards/${this.cardData.cardCode}.png`);
		this.sprite = new PIXI.Sprite(this.texture);
	
		// // Old. use this to get no scaling stuff.
		// this.sprite.width = 680 * scale;
		// this.sprite.height = 1024 * scale;

		this.sprite.width = 1;
		this.sprite.height = 1;

		this.startScale = 0;
		this.targetScale = scale;

		this.sprite.anchor.set(0);
		this.sprite.x = x;
		this.sprite.y = y;
		GameBoard.app.stage.addChild(this.sprite);

		this.startX = x;
		this.startY = y;
		this.targetX = x;
		this.targetY = y;
		this.addTimer = 0;
	}
	
	remove() {
		this.startScale = this.targetScale;
		this.targetScale = 0;
		this.removeTimer = 0;
	}

	moveTo(x, y, scale) {
		
		y = 1080 - y;

		this.startX = this.sprite.x;
		this.startY = this.sprite.y;
		this.targetX = x;
		this.targetY = y;
		this.targetScale = scale;
		this.moveTimer = 0;
	}

	update(deltaTime) {
		// TODO: Put this somewhere else?
		function lerp(v0, v1, t) {
			return v0*(1-t)+v1*t
		}

		if (this.addTimer < 1) {
			this.addTimer += deltaTime * 0.001;
			if (this.addTimer > 1) this.addTimer = 1; // Make sure we don't overscale.
			const newScale = lerp(this.startScale, this.targetScale, this.addTimer);

			this.sprite.width = 680 * newScale;
			this.sprite.height = 1024 * newScale;
		}

		if (this.moveTimer < 1) {
			this.moveTimer += deltaTime * 0.001;
			if (this.moveTimer > 1) this.moveTimer = 1; // Make sure we don't move too far.
			const newScale = lerp(this.startScale, this.targetScale, this.addTimer);

			this.sprite.width = 680 * newScale;
			this.sprite.height = 1024 * newScale;

			const newX = lerp(this.startX, this.targetX, this.moveTimer);
			const newY = lerp(this.startY, this.targetY, this.moveTimer);

			this.sprite.x = newX;
			this.sprite.y = newY;

			this.sprite.width = 680 * newScale;
			this.sprite.height = 1024 * newScale;
		}

		if (this.removeTimer < 1) {
			this.removeTimer += deltaTime * 0.001;
			if (this.removeTimer > 1) {
				this.removeTimer = 1; // We've deleted past this point.
				GameBoard.app.stage.removeChild(this.sprite);

				return true; // should remove
			}

			const newScale = lerp(this.startScale, this.targetScale, this.removeTimer);

			this.sprite.width = 680 * newScale;
			this.sprite.height = 1024 * newScale;
		}

		return false;
	}
}
import * as PIXI from "pixi.js";
import CardDatabase from "./card_database"
import Button from "./ui/button"

export default {

	app: null,

	width: 1,
	height: 1,
	originalWidth: 1920,
	originalHeight: 1080,
	scaleWidth: 1,
	scaleHeight: 1,
	scale: 1,

	create: function(width, height) {

		this.app = new PIXI.Application({
			width: width, 
			height: height, 
			backgroundColor: 0x1099bb, 
			resolution: window.devicePixelRatio || 1,
		});

		this.width = width;
		this.height = height;
		
		this.scaleHeight = height / this.originalHeight;
		this.scaleWidth = width / this.originalWidth;
		this.scale = this.scaleWidth < this.scaleHeight ? this.scaleWidth : this.scaleHeight;
		console.log(`GameBoard scale: ${this.scale} (w: ${this.scaleWidth} vs h: ${this.scaleHeight})`);

		this.app.view.style.width = '100%'; // TODO: Not this.
		document.body.appendChild(this.app.view);
	},

	playTestReplay: async function() {
		let playing = true;
		const button = new Button("assets/placeholder/play_button.png", 0, 0, () => {},
		() => { // On up
			playing = !playing;
		});

		let timeMS = 19000;
		let lastFrame = 18;
		const cards = {};
		let downloadCount = 0;

		const downloadText = new PIXI.Text(`Downloading all files: 0/601`);
		downloadText.x = 0;
		downloadText.y = 500;
		this.app.stage.addChild(downloadText);

		const fpsText = new PIXI.Text(`delta: fps`);
		fpsText.x = 0;
		fpsText.y = 100;
		this.app.stage.addChild(fpsText);

		let requests = [];
		for (let i = 0; i <= 600; i++) {
			const responseRequest = fetch(`assets/LOR_CARD_POSITIONS/${i}.json`).then((r) => {
				downloadCount++;
				downloadText.text = `Downloading all files: ${downloadCount}/601`;
				return r;
			});
			requests.push(responseRequest);
		}

		let responses = await Promise.all(requests);
		this.app.stage.removeChild(downloadText);

		const frames = [];
		for (let i = 0; i <= 600; i++) {
			const response = responses[i];
			const frame = await response.json();

			frames.push(frame);
		}

		requests = [];
		responses = [];

		function rectToScale(rect) { 
			return rect.Width / 680;
		}

		let timeDiff = 0;
		let lastTime = 19000;

		setInterval(() => {
			timeDiff = timeMS - lastTime;
			lastTime = timeMS;
		}, 1000);

		this.app.ticker.add((timeScale) => {
			if (playing == false)
				return;

			// Increase timer
			console.log(PIXI.Ticker.shared);
			let delta = PIXI.Ticker.shared.elapsedMS * timeScale;
			let claimedFPS = PIXI.Ticker.shared.FPS;
			timeMS += delta;

			// Get current frame. If frame is different, set it up
			let frameIndex = Math.floor(timeMS / 1000);
			fpsText.text = `Delta: ${delta}\nTimeDiff: ${timeDiff}\nFrame: ${timeMS / 1000}/600`;
			if (frameIndex != lastFrame) {
				const frame = frames[frameIndex];

				// Track cards we've not handled.
				const handledCards = {};
				for (let cardID of Object.keys(cards)) {
					handledCards[cardID] = false;
				}

				// For each card that we're tracking
				for (const rect of frame.Rectangles) {
					if (cards[rect.CardID] == null) { // Doesn't exist yet. Add it.
						const CardType = CardDatabase.getCardType(rect.CardCode);
						const card = new CardType(rect.CardID);
						card.add(rect.TopLeftX, rect.TopLeftY, rectToScale(rect));

						cards[rect.CardID] = card;
						console.log(`Added a card (${rect.CardID}) at ${rect.TopLeftX}, ${rect.TopLeftY}.`);
					}
					else {
						const card = cards[rect.CardID];

						if (card.targetX != rect.TopLeftX || card.targetY != rect.TopLeftY) {
							console.log(`Moving card ${rect.CardID} from ${card.targetX}, ${card.targetY} to ${rect.TopLeftX}, ${rect.TopLeftY}.`);
							card.moveTo(rect.TopLeftX, rect.TopLeftY, rectToScale(rect));
						}
					}

					handledCards[rect.CardID] = true;
				}

				// Remove removed cards.
				for (let id of Object.keys(cards)) {
					if (handledCards[id] === true)
						continue;

					cards[id].remove();
					console.log(`Removing card ${id}.`);
				}

				lastFrame = frameIndex;
			}

			for (const cardId in cards) {
				const shouldRemove = cards[cardId].update(delta);

				if (shouldRemove) {
					delete cards[cardId];
				}
			}
		});

	}
}
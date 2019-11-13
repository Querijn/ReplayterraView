// This NodeJS script creates a test replay, to visualise the info in the test data of stelar.
const fs = require("fs");

const trackedCards = {};
const cardActions = {};

function widthToScale(rect) {
	return rect.Width / 680;
}

function addCardAction(frameIndex, actionName, info) {
	if (cardActions[frameIndex] == null) {
		cardActions[frameIndex] = [];
	}

	cardActions[frameIndex].push({ frame: frameIndex, actionName, info });
}

// Generate replay
for (let frameIndex = 0, frameCount = 600; frameIndex < frameCount; frameIndex++) {
	const frameData = JSON.parse(fs.readFileSync(`assets/LOR_CARD_POSITIONS/${frameIndex}.json`).toString());

	if (frameData.PlayerName === null || frameData.OpponentName  === null)
		continue;

	frameData.Rectangles.forEach((rect) => {
		const card = trackedCards[rect.CardID];
		if (card == null) {
			trackedCards[rect.CardID] = { id: rect.CardID, x: rect.TopLeftX, y: rect.TopLeftY, code: rect.CardCode, scale: widthToScale(rect) };
			addCardAction(frameIndex, "add", { id: rect.CardID, img: rect.CardCode, x: rect.TopLeftX, y: rect.TopLeftY, scale: widthToScale(rect)  });
			return;
		}
		
		if (card.x != rect.TopLeftX || card.y != rect.TopLeftY || Math.abs(card.scale - widthToScale(rect)) > 0.01) {
			card.x = rect.TopLeftX;
			card.y = rect.TopLeftY;
			card.scale = widthToScale(rect);
			addCardAction(frameIndex, "move", { id: rect.CardID, x: card.x, y: card.y, scale: card.scale });
		}
	});
}

fs.writeFileSync("assets/test_replay.json", JSON.stringify({ cards: trackedCards, cardActions }));
console.log("Written test replay.");
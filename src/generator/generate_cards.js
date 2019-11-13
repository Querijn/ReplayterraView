// This NodeJS script creates the card code implementations based on the set.
const Mustache = require("mustache");
const fs = require("fs");

const sourceData = JSON.parse(fs.readFileSync("assets/en_us/data/set1-en_us.json").toString());
const cardMustacheFile = fs.readFileSync("src/generator/card_code.mst").toString();
const databaseMustacheFile = fs.readFileSync("src/generator/card_database.mst").toString();

cards = [];

sourceData.forEach(cardData => {
	const card = {
		code: cardData.cardCode,
		data: cardData,
		dataString: JSON.stringify(cardData).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
	};
	var cardJsSource = Mustache.render(cardMustacheFile, card);

	fs.writeFileSync(`src/cards/base/card_${card.code}.js`, cardJsSource);
	cards.push(card);
});


var databaseSource = Mustache.render(databaseMustacheFile, { cards });
fs.writeFileSync(`src/base_card_database.js`, databaseSource);
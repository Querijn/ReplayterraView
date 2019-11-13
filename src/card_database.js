import BaseCardDatabase from "./base_card_database";
import CardFace from "./cards/card_face";

export default {
	base: BaseCardDatabase,

	getCardType: function (code) {

		// TODO: Make overrides:
		switch (code) {
			case "face":
				return CardFace;
		}

		// Return code-less base.
		console.warn(`Warning: Returning code-less base for ${code}, this one needs an implementation.`);
		return this.base[code];
	}
}
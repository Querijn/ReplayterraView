import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import CardData from "../card_data.js";
import AnimationDelay from "../animation/animation_delay.js";

export default class ReplaceMulliganCardsAction extends BaseAction {

	oldCards = [];
	newCards = [];
	finalAnimation = null;

	constructor(isYou, oldCardCodes, finalCards) {
		super("ReplaceMulliganCards", isYou);
		
		this.indicesToRemove = [];
		for (let i = 0; i < oldCardCodes.length; i++) {

			const oldCode = oldCardCodes[i];
			const finalCode = finalCards[i];

			if (oldCode != finalCode) { // If we replace it
				this.indicesToRemove.push(i);
				this.newCards.push(new CardData("", finalCode));
				this.oldCards.push(new CardData("", oldCode));
			}
		}

		debug.log("old cards: ", this.oldCards);
		debug.log("new cards: ", this.newCards);
	}
	
	isReadyToPlay(timeMs) {
		if (Replay.lastTimeAction(this.isYou) < 0)
			return false;

		return timeMs - Replay.lastTimeAction(this.isYou) > 3000;
	}

	isDone(timeMs) {
		return this.finalAnimation && this.finalAnimation.isDoneAt(timeMs);
	}
	
	play(skipAnimations) {

		const drawCard = () => {
			player.deck.drawFromTop(player.mulligan, skipAnimations)
			.onDone((anim) => {
				anim.owner.showFront(0, skipAnimations ? 0 : 250);
			});
		};

		const player = this.isYou ? Replay.you : Replay.opponent;
		for (let i = this.indicesToRemove.length - 1; i >= 0; i--) {

			const index = this.indicesToRemove[i];

			const mulliganCard = player.mulligan.cards[index];
			if (mulliganCard == null)
				throw new Error(`Could not find card ${index}!`);
			
			player.mulligan.moveToContainer(mulliganCard, player.deck, skipAnimations);

			if (skipAnimations)
				drawCard();
			else 
				setTimeout(drawCard, 250 * i);
		}

		const onDone = () => {
			this.finalAnimation = player.mulligan.moveAllToContainer(player.hand, skipAnimations);
		};

		if (skipAnimations)
			onDone();
		else 
			setTimeout(onDone, 1000 + 250 * this.indicesToRemove.length); // A second after the last reveal.
	}

	get deckCardData() {
		return this.newCards;
	}
	
	identifyCard(code, id) {
		for (const card of this.oldCards) {
			if (card.id === "" && code === card.code) {
				debug.log(`${this.name}: Identified old card ${code} -> ${id}..`);
				card.id = id;
				break;
			}
		}

		for (const card of this.newCards) {
			if (card.id === "" && code === card.code) {
				debug.log(`${this.name}: Identified new card ${code} -> ${id}..`);
				card.id = id;
				return;
			}
		}
	}

	get isIdentified() {
		
		for (const card of this.newCards)
			if (card.id === "")
				return false;
		return true;
	}
}
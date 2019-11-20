import BaseAction from "./base_action.js";
import Replay from "../replay.js";
import CardData from "../card_data.js";
import AnimationDelay from "../animation/animation_delay.js";

export default class ReplaceMulliganCardsAction extends BaseAction {

	oldCards = [];
	newCards = [];

	constructor(isYou, oldCardCodes, finalCards) {
		super("ReplaceMulliganCards");

		ReplaceMulliganCardsAction.settleCount = 0;

		this.isYou = isYou;


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

		console.log("old cards: ", this.oldCards);
		console.log("new cards: ", this.newCards);
	}
	
	isReadyToPlay(timeMs) {
		if (Replay.timeMulliganResolved < 0)
			return false;

		return timeMs - Replay.timeMulliganResolved > 1000;
	}

	isDone(timeMs) {
		return ReplaceMulliganCardsAction.settleCount == 2;
	}

	static settleCount = 0;
	static timeSettled = -1;
	static settle(skipAnimations) {
		this.settleCount++;
		if (this.settleCount == 2) {
			Replay.opponent.mulliganView.moveToHand(skipAnimations);
			Replay.you.mulliganView.moveToHand(skipAnimations);
			this.timeSettled = performance.now();
		}
	}

	play() {
		this._playInternal(false);
	}

	resolveImmediately() {
		this._playInternal(true);
	}

	_playInternal(skipAnimations) {
		const player = this.isYou ? Replay.you : Replay.opponent;
		debug.log(`${performance.now()}: Playing ${this.name} for ${this.isYou ? "you" : "them"}: deck card count: ${player.deck.cards.length}, mull card count: ${player.mulliganView.cards.length} ${skipAnimations ? "(skipping animations)" : ""}`);
		
		let pos = 0;
		for (const i of this.indicesToRemove) {
			const cardIndex = player.mulliganView.cards[i];
			if (cardIndex < 0)
				throw new Error(`Could not find a removed card!`);

			const card = player.mulliganView.cards.splice(cardIndex, 1)[0];
			const cardPos = i;
			player.deck.addToBottom(card, skipAnimations).onDone(() => {
				player.deck.drawToMulliganView(cardPos, skipAnimations).onDone(() => {

					card.addAnimation()
					.add(new AnimationDelay(skipAnimations ? 0 : 2000))
					.onDone(() => { 
						ReplaceMulliganCardsAction.settle(skipAnimations);
					});
				});
			});
		}
	}

	get deckCardData() {
		return this.newCards;
	}

	isPlayerAction(isYou) {
		return this.isYou == isYou;
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

		debug.warn(`${this.name}: Could not find card for code ${code}? I wanted to assign ID ${id}..`);
	}

	get isIdentified() {
		
		for (const card of this.newCards)
			if (card.id === "")
				return false;
		return true;
	}
}
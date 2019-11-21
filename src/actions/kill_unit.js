import BaseAction from "./base_action.js";
import Replay from "../replay.js";

export default class KillUnitAction extends BaseAction {

	constructor(isYou, card) {
		super("KillUnit", isYou);

		this.card = card;
		this.done = false;
	}

	isReadyToPlay(timeMs) {
		if (Replay.lastTimeAction(this.isYou) < 0)
			return false;

		return timeMs - Replay.lastTimeAction(this.isYou) > 1000;
	}

	isDone(timeMs) {
		return this.done;
	}

	play(skipAnimations) {

		const player = this.isYou ? Replay.you : Replay.opponent;
		const [ container, card ] = player.findCard(this.card.id);
		if (container && card) {
			container.destroyCard(card, skipAnimations).onDone(() => {
				this.done = true;
			});
		}
		else {
			this.done = true;
		}
	}

	get deckCardData() {
		return [];
	}
}
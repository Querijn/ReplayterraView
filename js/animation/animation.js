import AnimationDoneHandler from "./animation_done.js";

export default class Animation {

	constructor(owner, effects) {

		this.owner = owner;
		this.reset();
		this._effects = (effects && effects.length != 0) ? effects : [];
	}

	reset() {
		this._onDoneFuncs = [];
		this._effects = [];
	}

	add(e) {
		this._effects.push(e);
		
		// This makes sure we call on done callbacks on animations that are already done, or have a duration of 0.
		if (this.length == 0)
			this.update(0);

		return this;
	}

	isDoneAt(timeMs) {
		for (const effect of this._effects)
			if (effect.isDoneAt(timeMs) == false)
				return false;

		return true;
	}

	onDone(onDoneFunc) {
		this._effects.push(new AnimationDoneHandler(onDoneFunc));

		return this;
	}

	update(timeMs) {

		let isDone = true;
		
		while (this._effects.length) {
			const effect = this._effects[0];
			if (effect.isDoneHandler) {
				if (effect.onDone) {
					effect.onDone(this);
					effect.onDone = null;
				}
			}
			else {
				effect.update(timeMs);
			}

			if (effect.isDoneAt(timeMs)) {
				this._effects.splice(0, 1);
			}
			else {
				break;
			}
		}
	}

	get length() { 
		return this._effects.reduce(function(prev, effect) {
			return prev + effect.duration;
		}, 0);
	}
}
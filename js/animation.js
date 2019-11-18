import AnimationDoneHandler from "./animation_done.js";

export default class Animation {

	constructor(effects) {
		this.reset();
		this._effects = (effects && effects.length != 0) ? effects : [];
	}

	reset() {
		this._onDoneFuncs = [];
		this._effects = [];
	}

	add(e) {
		this._effects.push(e);
		
		return this;
	}

	isDone() {
		const timeMs = performance.now();
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
		for (const effect of this._effects) {

			if (effect.isDoneHandler) {
				if (effect.onDone) {
					effect.onDone(this);
					effect.onDone = null;
				}
			}
			else {
				effect.update(timeMs);
			}

			if (!effect.isDoneAt(timeMs)) {
				isDone = false;
				break;
			}
		}

		if (isDone && this._effects.length > 0) {
			const onDoneFuncs = this._onDoneFuncs;
			this.reset();
		}
	}

	get length() { 
		return this._effects.reduce(function(prev, effect) {
			return prev + effect.duration;
		}, 0);
	}
}
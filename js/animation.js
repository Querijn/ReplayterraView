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
		this._onDoneFuncs.push(onDoneFunc);
	}

	update(timeMs) {

		let isDone = true;
		for (const effect of this._effects) {

			effect.update(timeMs);
			if (!effect.isDoneAt(timeMs)) {
				isDone = false;
				break;
			}
		}

		if (isDone && this._effects.length > 0) {
			for (const onDone in this._onDoneFuncs)
				onDone(this);

			this.reset();
		}
	}
}
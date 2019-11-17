export default class AnimationEffect {

	constructor(effectFunction, target, propertyName, targetValue, duration) {
		this.effectFunction = effectFunction;

		this.target = target;
		this.propertyName = propertyName;

		this.startValue = this.target[propertyName];
		this.targetValue = targetValue;
		this.valueRange = this.targetValue - this.startValue;

		this.startTime = -1;
		this.endTime = this.startTime + duration;
	}

	getUnboundProgress(time) {
		return (time - this.startTime) / (this.endTime - this.startTime); // 0 ~ 1 (not boundchecked)
	}

	getProgress(time) {
		return Math.min(Math.max(this.getUnboundProgress(time), 0), 1); // Ensure 0 ~ 1
	}

	isDoneAt(time) {
		return this.getUnboundProgress(time) >= 1;
	}

	update(timeMs) {
		if (this.startTime < 0)
			this.startTime = performance.now();

		const t = this.getProgress(timeMs);
		const coeff = this.effectFunction(t);
		this.target[this.propertyName] = this.valueRange * coeff + this.startValue;
	}
}
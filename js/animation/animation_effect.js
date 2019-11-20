export default class AnimationEffect {

	static isSkippingToPoint = false;

	constructor(effectFunction, target, propertyName, targetValue, duration) {
		this.effectFunction = effectFunction;

		this.target = target;
		this.propertyName = propertyName;

		this.startValue = this.target[propertyName];
		this.targetValue = targetValue;
		this.valueRange = this.targetValue - this.startValue;

		if (AnimationEffect.isSkippingToPoint && duration !== 0) {
			debug.warn(`We're playing an animation with a duration of ${duration} while we're skipping! This needs to be fixed!`);
			duration = 0;
		}

		this.startTime = -1;
		this.duration = duration;

		this.wasDone = false;
	}

	getUnboundProgress(time) {
		if (this.startTime < 0)
			return 0;

		if (this.endTime - this.startTime == 0)
			return 1;

		return (time - this.startTime) / (this.endTime - this.startTime); // 0 ~ 1 (not boundchecked)
	}

	getProgress(time) {
		if (this.startTime < 0)
			return 0;

		return Math.min(Math.max(this.getUnboundProgress(time), 0), 1); // Ensure 0 ~ 1
	}

	isDoneAt(time) {
		if (this.startTime < 0)
			return false;

		return this.getUnboundProgress(time) >= 1;
	}

	update(timeMs) {
		if (this.startTime < 0) {
			this.startTime = timeMs;
			this.endTime = this.startTime + this.duration;
			
			this.startValue = this.target[this.propertyName];
			this.valueRange = this.targetValue - this.startValue;
		}

		const t = this.getProgress(timeMs);
		const coeff = this.effectFunction(t) || 0;
		this.target[this.propertyName] = this.valueRange * coeff + this.startValue;
		
		this.wasDone = t >= 1;
	}
}
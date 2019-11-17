import PlayerSide from "./player_side.js";
import Scene from "./scene.js";
import ShowMulliganCards from "./actions/show_mulligan_cards.js";

export default class Replay {

	static speed = 1;
	static players = [ new PlayerSide(true), new PlayerSide(false) ];
	static lastTime = -1;
	static lastTimer = -1;
	static forcedTime = -1;
	static actions = [];
	static _currentActionIterator = 0;

	static setupField(timeMs) {
		console.log(`Reinitialising field at time ${timeMs}..`);
		this.lastTime = timeMs;
	}

	static getAction(data) {

		const actionName = data.name;
		switch (actionName) {
			case "ShowMulliganCards":
				return new ShowMulliganCards(data.time, data.isYou, data.cards);

			default:
				throw new Error(`Unknown action ${actionName}! Args given:`, data);
		}
	}
	
	static play(actions) {
		
		if (typeof actions !== 'number') { // Add new actions
			console.log(`Adding ${actions.length} new actions..`);
			for (let actionData of actions) {
				const action = Replay.getAction(actionData);
				action.time += 2000;

				Replay.actions.push(action);
			}

			Replay.actions.sort((a, b) => a.time - b.time);

			Replay.players[0].deck.prepare();
			Replay.players[1].deck.prepare();
		}

		requestAnimationFrame(Replay.play); // Prepare next frame.

		const deltaMs = (performance.now() - Replay.lastTimer) * Replay.speed;
		const timeMs = Replay.lastTime >= 0 ? Replay.lastTime + deltaMs : 0;

		// If time was forced
		if (Replay.forcedTime >= 0) {
			timeMs = Replay.forcedTime;
			Replay.forcedTime = -1;
		}

		if (Replay.lastTime < 0 || Math.abs(timeMs - Replay.lastTime) > 1000) { // First time playing or difference in time is longer than a second, reinit.
			Replay.setupField(timeMs);
		}
		else while (Replay.currentAction && Replay.currentAction.time > timeMs) {
			Replay.currentAction.play();
			Replay._currentActionIterator++;
		}

		Replay.lastTime = timeMs;
		Replay.lastTimer = performance.now();
		Scene.update(timeMs);
	}

	static get currentAction() {
		return this.actions[this._currentActionIterator];
	}
}
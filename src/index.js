import Scene from "./scene.js";
import Replay from "./replay.js";

async function test() {
  console.log("ReplayterraView opened.");

  await Scene.loadAsThreeJS();
  document.body.appendChild(Scene.renderer.domElement);

  const urlParams = new URLSearchParams(window.location.search);
  const replayRequest = urlParams.get("replay") || "assets/test.json";

  const response = await fetch(replayRequest);
  const actions = await response.json();

  Replay.play(actions);
}

export async function loadReplay(canvas, uuid) {
  console.log("ReplayterraView opened.");

  await Scene.loadAsThreeJS(canvas);

  const data = await fetch("http://lor.stelar7.no/api/replay_by_id.php?id=" + uuid);
  const tracker = (await data.json())["tracker_id"];

  const response = await fetch("http://lor.stelar7.no/api/replays/" + uuid + "/" + tracker + "/parsed.json");
  const actions = await response.json();

  Replay.play(actions);

  return Replay;
}

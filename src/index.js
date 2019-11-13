import GameBoard from "./game_board";

const width = 1920;
const height = 1080;

GameBoard.create(width, height);
GameBoard.playTestReplay("assets/test_replay.json");
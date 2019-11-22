# ReplayterraView
Replayterra's board in which a replay takes place.

It downloads the replay made by ReplayterraLibrary, and plays them one by one in a ThreeJS context.

## Setup

Run the following in the command line
```
npm install
webpack
```
This produces the index.js needed. Now you can run the index.html in a server setup, and it should play a default replay automatically!

## Running it

1. See index.js for a full description on how to start!
2. `Replay.play(data);` starts the replay. 
3. At any point, you can set the speed of the replay with `Replay.speed = <your speed>;`
4. You can skip to any action in the replay by using `Replay.skipToAction(<actionIndex>);`
5. `Replay.currentActionIndex` gives you the current index.
6. `Replay.actionCount` gives you the amount of replays.


import * as Phaser from "phaser";
import MainMenu from "./scenes/MainMenu.js";
import GameScene from "./scenes/GameScene";
import GameScore from "./scenes/GameScore";
import HighScores from "./scenes/HighScores";
import Credits from "./scenes/Credits";
import Form from "./scenes/Form.js";
// import { MainMenu, GameScene, GameScore, HighScores, Credits } from "./scenes";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  dom: { createContainer: true },
  width: innerWidth,
  height: innerHeight,
  scene: [MainMenu, GameScene, GameScore, HighScores, Credits, Form],

  render: {
    pixelArt: true,
  },
};

const game = new Phaser.Game(config);

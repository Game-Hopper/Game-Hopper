import * as Phaser from 'phaser';
import MainMenu from './scenes/MainMenu.js';
import GameScene from './scenes/GameScene';
import Jackie from './scenes/Jackie';
import GameScore from './scenes/GameScore';
import HighScores from './scenes/HighScores';
import Credits from './scenes/Credits';
import Form from './scenes/Form.js';
import Preloader from './scenes/Preloader.js';
import HealthBar from './helpers/HealthBar';
import GameSceneTester from './helpers/HealthBarSprite.js';
import Intro from './scenes/Intro';
import FallingScene from './scenes/FallingScene';
import FirstFight_Start from './scenes/FirstFight_Start.js';
import FirstFight_Two from './scenes/FirstFight_Two';
import FirstFight_Three from './scenes/FirstFight_Three.js';

// import { MainMenu, GameScene, GameScore, HighScores, Credits } from "./scenes";

const config = {
  type: Phaser.AUTO,
  dom: { createContainer: true },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: innerWidth,
    height: innerHeight,
  },
  scene: [
    Preloader,
    MainMenu,
    GameScene,
    GameScore,
    HighScores,
    Credits,
    Form,
    HealthBar,
    Jackie,
    Intro,
    GameSceneTester,
    FallingScene,
    FirstFight_Start,
    FirstFight_Two,
    FirstFight_Three,
  ],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: true,
    },
  },

  render: {
    pixelArt: true,
  },
};

const game = new Phaser.Game(config);

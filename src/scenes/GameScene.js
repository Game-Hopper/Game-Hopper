import { Scene, physics } from 'phaser';
import HealthBar from '../helpers/HealthBar.js';
import { Lisa } from '../sprites/Lisa.js';
import { FlyGuy } from '../sprites/Enemies/FlyGuy.js';
// import HealthBarSprite from './HealthBarSprite';

class GameScene extends Scene {
  player;
  enemy;
  platforms;
  waterFallPlatform;
  cursors;
  timer;

  bar;

  map;
  groundLayer;
  surfaceTileset;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const x = innerWidth / 2;
    const y = innerHeight / 2;

    this.background = this.add.image(0, 0, 'shiny_stars').setOrigin(0, 0);
    this.background.displayWidth = this.sys.canvas.width;
    this.background.displayHeight = this.sys.canvas.height;

    let mainMenuButton = this.add
      .image(x / 2, y * 1.8, 'main-menu')
      .setScale(3);
    mainMenuButton.setInteractive();

    mainMenuButton.on('pointerup', () => {
      this.scene.switch('MainMenu');
    });

    //timer
    let timeTextStyle = {
      font: '24px Roboto',
      fill: '#E43AA4',
      stroke: '#000',
      strokeThickness: 4,
    };
    this.timer = this.add
      .text(x, innerHeight / 10, 'Time: ', timeTextStyle)
      .setOrigin(0.5, 0.5);

    // Creating Player (Lisa)
    this.player = new Lisa(this, x, y);

    //ADD SOMETHING TO MAKE TORI APPEAR WHEN IN TWO PLAYER MODE
    // this.add.text(x + 400, innerHeight / 14, 'TORI');
    // this.makeBar(x + 400, innerHeight / 10, 0xc1c1c1);
    // let toriHealth = this.makeBar(x + 400, innerHeight / 10, 0xcc2e3a);
    // this.setValue(toriHealth, 5);

    //Background - First Scene
    this.map = this.make.tilemap({ key: 'tilemap' });
    this.surfaceTileset = this.map.addTilesetImage('surface', 'tiles');
    this.vegetationOneTileset = this.map.addTilesetImage(
      'vegetation',
      'vegetation1'
    );

    this.vegetationTwoTileset = this.map.addTilesetImage(
      'vegetation_color',
      'vegetation2'
    );

    this.groundLayer = this.map.createLayer(
      'ground',
      this.surfaceTileset,
      0,
      0
    );
    this.vegetationLayerOne = this.map.createLayer(
      'vegetation',
      this.vegetationOneTileset,
      0,
      0
    );
    this.vegetationLayerTwo = this.map.createLayer(
      'vegetation_color',
      this.vegetationTwoTileset,
      0,
      0
    );

    this.hearts = this.physics.add.group({
      key: 'heart',
      repeat: 9,
      allowGravity: false,
    });
    this.hearts.children.iterate(function (child) {
      for (var i = 0; i < 9; i++) {
        child.setPosition(
          Phaser.Math.RND.between(0, 1400),
          Phaser.Math.RND.between(400, 600)
        );
        child.setOrigin(0, 0);
      }
    });

    // this.physics.add.collider(this.hearts, this.groundLayer);
    this.physics.add.overlap(
      this.player,
      this.hearts,
      this.player.collectHeart,
      null,
      this
    );

    // Invisible platform
    this.platforms = this.physics.add.staticGroup();
    this.waterFallPlatform = this.platforms
      .create(this.sys.canvas.width / 2 + 60, this.sys.canvas.height, 'test')
      .refreshBody();
    this.physics.add.collider(this.player, this.waterFallPlatform, () => {
      this.scene.switch('OneFallingScene');
    });
    this.waterFallPlatform.setVisible(false);

    //resizing to fit the playable game scene
    this.groundLayer.displayWidth = this.sys.canvas.width;
    this.groundLayer.displayHeight = this.sys.canvas.height;
    this.vegetationLayerOne.displayWidth = this.sys.canvas.width;
    this.vegetationLayerOne.displayHeight = this.sys.canvas.height;
    this.vegetationLayerTwo.displayWidth = this.sys.canvas.width;
    this.vegetationLayerTwo.displayHeight = this.sys.canvas.height;

    this.physics.add.collider(this.player, this.groundLayer);
    this.physics.add.collider(this.player, this.surfaceTileset);
    this.groundLayer.setCollisionBetween(72, 99);

    // creating the enemy sprite

    this.enemy = new FlyGuy(this, x, y, this.player).setScale(1.7);
    // this.bar = new HealthBarSprite(this, x, y);

    // Collider so enemy and player can interact
    this.physics.add.collider(this.player, this.enemy);
  }

  update(time) {
    // Update Player
    this.player.update();
    // this.enemy.update();

    // // Do enemy AI
    this.enemyFollows();

    //healthbar changing
    // this.lisaHealth.update();
    // this.setValue(this.lisaHealth, this.player.hp);

    // Timer
    let gameRunTime = time * 0.001;
    this.timer.setText('Time: ' + Math.round(gameRunTime) + ' seconds ');
  }

  // Following Enemy AI
  enemyFollows() {
    this.physics.moveToObject(this.enemy, this.player, 100);
  }
}

export default GameScene;

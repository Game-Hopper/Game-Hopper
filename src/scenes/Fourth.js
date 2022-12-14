import { Scene } from 'phaser';
import { Lisa } from '../sprites/Lisa.js';
import { FlyGuy } from '../sprites/Enemies/FlyGuy.js';
import { LaserGroup } from '../weapons/Fire/Laser/LaserGroup.js';

class Fourth extends Scene {
  cameras;
  player;
  platforms;
  goombaPlatform;
  portal;
  laserGroup;
  enemiesArray = [];
  isPaused = false;

  constructor(data) {
    super('Fourth');
  }

  create(data) {
    const x = innerWidth / 2;
    const y = innerHeight / 2;

    // Background
    this.sun = this.add.image(0, 0, 'sun').setOrigin(0, 0);
    this.sun.displayWidth = this.sys.canvas.width;
    this.sun.displayHeight = this.sys.canvas.height;

    //Tilemao
    this.map = this.make.tilemap({ key: 'tilemap_FF2' });

    //Tilesets
    this.groundTileset = this.map.addTilesetImage('ground_tileset', 'tiles');

    this.rocksAndPlantsTileset = this.map.addTilesetImage(
      'plants_rocks_tileset',
      'vegetation2'
    );

    this.rocksAndPlantsTilesetTwo = this.map.addTilesetImage(
      'plants_rocks_tileset_2',
      'vegetation1'
    );

    this.mechanicalTileset = this.map.addTilesetImage(
      'mechanical_tileset',
      'mechanical'
    );

    this.groundAndPlatforms = this.map.createLayer(
      'ground_layer',
      this.groundTileset,
      0,
      0
    );

    //Layers
    this.mechanicalLayer = this.map.createLayer(
      'mechanical_layer',
      this.mechanicalTileset,
      0,
      0
    );

    //Lisa
    this.player = new Lisa(this, x, y, data.hp, data.score).setPosition(
      0,
      y + y / 4
    );

    this.rocksAndPlants = this.map.createLayer(
      'rocks_and_plants_layer',
      this.rocksAndPlantsTileset,
      0,
      0
    );

    this.invisibleLayer = this.map
      .createLayer('invisible_layer', this.groundTileset, 0, 0)
      .setVisible(false);

    this.rocksAndPlantsTwo = this.map.createLayer(
      'rocks_and_plants_layer_2',
      this.rocksAndPlantsTilesetTwo,
      0,
      0
    );

    //Display adjustments
    this.groundAndPlatforms.displayWidth = this.sys.canvas.width;
    this.groundAndPlatforms.displayHeight = this.sys.canvas.height;
    this.rocksAndPlants.displayWidth = this.sys.canvas.width;
    this.rocksAndPlants.displayHeight = this.sys.canvas.height;
    this.rocksAndPlantsTwo.displayWidth = this.sys.canvas.width;
    this.rocksAndPlantsTwo.displayHeight = this.sys.canvas.height;
    this.mechanicalLayer.displayWidth = this.sys.canvas.width;
    this.mechanicalLayer.displayHeight = this.sys.canvas.height;
    this.invisibleLayer.displayWidth = this.sys.canvas.width;
    this.invisibleLayer.displayHeight = this.sys.canvas.height;

    //Terrain collisions
    this.physics.add.collider(this.player, this.groundAndPlatforms);
    this.groundAndPlatforms.setCollisionBetween(142, 170);
    this.physics.add.collider(
      this.player,
      this.invisibleLayer,
      this.player.hitSpikyPlant
    );
    this.invisibleLayer.setCollisionBetween(139, 170);

    //PAUSE BUTTON
    let pauseButton = this.add
      .text(innerWidth - 200, innerHeight * 0.05, 'PAUSE')
      .setScale(2);
    pauseButton.setInteractive();

    pauseButton.on('pointerup', () => {
      this.isPaused = !this.isPaused;
      if (!this.isPaused) {
        this.game.loop.sleep();
      } else {
        this.game.loop.wake();
      }
    });

    // laserGroup
    this.laserGroup = new LaserGroup(this);

    //healthHearts
    this.hearts = this.physics.add.group({
      key: 'heart',
      repeat: 5,
      allowGravity: false,
      setXY: { x: x / 3, y: y / 2, stepX: 100 },
    });

    this.physics.add.collider(this.hearts, this.wallPlatform);
    this.physics.add.collider(this.hearts, this.groundAndPlatforms);
    this.hearts.children.iterate(function (child) {
      for (var i = 0; i < 5; i++) {
        child.setBounce(1),
          child.setOrigin(0, 0),
          child.setVelocity(Phaser.Math.Between(-200, 200)),
          child.setCollideWorldBounds(true);
      }
    });

    this.physics.add.overlap(
      this.player,
      this.hearts,
      this.player.collectHeart,
      null,
      this
    );

    //baddies
    this.time.addEvent({
      delay: 7000,
      callback: function () {
        this.flyGuy = new FlyGuy(
          this,

          Phaser.Math.RND.between(0, 2000),
          0
        ).setScale(x * 0.002);

        this.physics.add.collider(this.flyGuy, this.groundAndPlatforms);
        this.physics.add.overlap(
          this.player,
          this.flyGuy,
          this.player.hitSpawn,
          null,
          this
        );
        this.physics.add.collider(this.player, this.flyGuy);
      },
      callbackScope: this,
      repeat: 10,
    });

    // create portal and set invisible
    this.portal = this.physics.add
      .sprite(x + x / 1.5, y, 'portal2')
      .setScale(x * 0.0055)
      .setVisible(false);
    this.portal.setCollideWorldBounds(true);

    this.portal.play('portalPlay2');

    this.enemiesArray = [];
  }

  update(data) {
    this.player.update();

    if (this.player.hp <= 0) {
      this.gameOver(data);
    }

    for (let i = 0; i < this.enemiesArray.length; i++) {
      this.enemiesArray[i].update();
    }

    if (this.player.heartCount >= 3 && this.player.enemiesKilled >= 3) {
      this.portal.setVisible(true);
      this.physics.add.collider(this.player, this.portal, () => {
        this.scene.start('Fifth', {
          hp: this.player.hp,
          score: this.player.score,
          timer: this.timer,
        });
      });
    }
    this.enemiesArray.filter((enemy) => enemy.hp > 0);
  }

  gameOver(data) {
    this.scene.start('GameOver', {
      music: data.music,
      hp: this.player.hp,
      score: this.player.score,
      timer: this.timer,
    });
  }
}

export default Fourth;

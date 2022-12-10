import { Scene } from 'phaser';
import { Lisa } from '../sprites/Lisa.js';
import { Enemy } from '../sprites/Enemies/Enemy';
import { LaserGroup } from '../weapons/Fire/Laser/LaserGroup.js';

class FirstFight_Two extends Scene {
  cameras;
  player;
  platforms;
  goombaPlatform;
  portal;
  laserGroup;
  enemiesArray = [];
  isPaused = false;

  constructor(data) {
    super({ key: 'FirstFight_Two' });
  }

  create(data) {
    // Background - First Scene

    const x = innerWidth / 2;
    const y = innerHeight / 2;

    this.sun = this.add.image(0, 0, 'sun').setOrigin(0, 0);
    this.sun.displayWidth = this.sys.canvas.width;
    this.sun.displayHeight = this.sys.canvas.height;
    this.map = this.make.tilemap({ key: 'tilemap_FF2' });

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

    this.mechanicalLayer = this.map.createLayer(
      'mechanical_layer',
      this.mechanicalTileset,
      0,
      0
    );

    //PAUSE BUTTON
    let pauseButton = this.add.text(x, innerHeight / 10, 'PAUSE').setScale(2);
    pauseButton.setInteractive();

    pauseButton.on('pointerup', () => {
      this.isPaused = !this.isPaused;
      if (!this.isPaused) {
        this.game.loop.sleep();
      } else {
        this.game.loop.wake();
      }
    });

    //Lisa
    this.player = new Lisa(
      this,
      x,
      y,
      data.has_gun,
      data.hp,
      data.score
    ).setPosition(100, 560);

    this.rocksAndPlants = this.map.createLayer(
      'rocks_and_plants_layer',
      this.rocksAndPlantsTileset,
      0,
      0
    );

    this.invisibleLayer = this.map.createLayer(
      'invisible_layer',
      this.rocksAndPlantsTileset,
      0,
      0
    );

    this.rocksAndPlantsTwo = this.map.createLayer(
      'rocks_and_plants_layer_2',
      this.rocksAndPlantsTilesetTwo,
      0,
      0
    );

    this.physics.add.collider(this.player, this.groundAndPlatforms);
    this.groundAndPlatforms.setCollisionBetween(142, 170);
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

    //Collisions
    this.physics.add.collider(
      this.player,
      this.invisibleLayer,
      this.player.hitSpikyPlant
    );

    this.invisibleLayer.setCollisionBetween(139, 170);
    // this.groundAndPlatforms.setCollisionBetween(720, 746);

    // laserGroup
    this.laserGroup = new LaserGroup(this);

    //healthHearts
    this.hearts = this.physics.add.group({
      key: 'heart',
      repeat: 5,
      allowGravity: false,
      setXY: { x: 300, y: 300, stepX: 100 },
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
    // this.spawnArray = [];
    this.time.addEvent({
      delay: 5000,
      callback: function () {
        this.spawn2 = new Enemy(
          this,

          Phaser.Math.RND.between(0, 2000),
          0
        ).setScale(1.5);
        this.enemiesArray.push(this.spawn2);
        this.physics.add.collider(this.spawn2, this.groundAndPlatforms);
        this.physics.add.overlap(
          this.player,
          this.spawn2,
          this.player.hitSpawn,
          null,
          this
        );
        this.physics.add.collider(this.player, this.spawn2);
      },
      callbackScope: this,
      repeat: 10,
    });

    // invisible platform for goombas only
    this.platforms = this.physics.add.staticGroup();
    this.goombaPlatform = this.platforms
      .create(this.sys.canvas.width - 150, this.sys.canvas.height - 147, 'test')
      .refreshBody()
      .setVisible(false);
    this.physics.add.collider(this.enemiesArray, this.goombaPlatform);

    // create portal and set invisible
    this.portal = this.physics.add
      .sprite(
        this.sys.canvas.width - 220,
        this.sys.canvas.height + 200,
        'portal2'
      )
      .setScale(3.5)
      .setVisible(false);
    this.portal.setCollideWorldBounds(true);
    this.physics.add.collider(this.portal, this.groundAndPlatforms);

    this.portal.play('portalPlay2');
  }

  update(data) {
    this.player.update();

    if (this.player.hp <= 0) {
      this.gameOver(data);
    }
    for (let i = 0; i < this.enemiesArray.length; i++) {
      this.enemiesArray[i].update();
    }

    if (this.player.heartCount >= 3) {
      this.portal.setVisible(true);
      this.physics.add.collider(this.player, this.portal, () => {
        this.scene.start('FirstFight_Three', {
          hp: this.player.hp,
          score: this.player.score,
          timer: this.timer,
          music: data.music,
          has_gun: data.has_gun,
        });
      });
    }
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

export default FirstFight_Two;

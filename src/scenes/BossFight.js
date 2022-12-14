import { Scene } from 'phaser';
import { Lisa } from '../sprites/Lisa.js';
import { LaserGroup } from '../weapons/Fire/Laser/LaserGroup.js';
import { Enemy } from '../sprites/Enemies/Enemy';
import { FlyGuy } from '../sprites/Enemies/FlyGuy';
import { BigBoss } from '../sprites/Enemies/BigBoss.js';
import { FireGroup } from '../weapons/Fire/FireGroup.js';

class BossFight extends Scene {
  cameras;
  player;
  platforms;
  waterFallPlatform;
  laserGroup;
  fireGroup;
  bigBoss;
  enemiesArray = [];
  fadeTriggered = false;
  isPaused = false;

  constructor(data) {
    super('BossFight');
  }

  typewriteText(text) {
    const length = text.length;
    let i = 0;
    this.time.addEvent({
      callback: () => {
        this.story.text += text[i];
        i++;
      },
      repeat: length - 1,
      delay: 6000,
    });
  }

  create(data) {
    const x = innerWidth / 2;
    const y = innerHeight / 2;

    // Camera shake
    this.shakeCameras();

    // LaserGroup
    this.laserGroup = new LaserGroup(this);

    // New FireGroup
    this.fireGroup = new FireGroup(this);

    // Background and terrain

    //Tilemap
    this.map = this.make.tilemap({ key: 'tilemap_BF' });

    //Tilesets
    this.bossRoomTilesetOne = this.map.addTilesetImage(
      'machine_room_tileset2',
      'boss_tileset1'
    );

    this.bossRoomTilesetTwo = this.map.addTilesetImage(
      'machine_room_tileset3',
      'boss_tileset2'
    );

    //Layers
    this.secondLayer = this.map.createLayer(
      'Second',
      this.bossRoomTilesetOne,
      0,
      0
    );

    this.thirdLayer = this.map.createLayer(
      'Third',
      this.bossRoomTilesetTwo,
      0,
      0
    );

    this.firstLayer = this.map.createLayer(
      'First',
      this.bossRoomTilesetOne,
      0,
      0
    );

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

    //Lisa
    this.player = new Lisa(this, x, y, data.hp, data.score).setPosition(
      0,
      y + y / 4
    );

    //Terrain colliders
    this.physics.add.collider(this.player, this.firstLayer);
    this.firstLayer.setCollisionBetween(160, 170);
    this.firstLayer.displayWidth = this.sys.canvas.width;
    this.firstLayer.displayHeight = this.sys.canvas.height;
    this.secondLayer.displayWidth = this.sys.canvas.width;
    this.secondLayer.displayHeight = this.sys.canvas.height;
    this.thirdLayer.displayWidth = this.sys.canvas.width;
    this.thirdLayer.displayHeight = this.sys.canvas.height;

    // spawning big boss
    this.time.addEvent({
      delay: 7000,
      callback: function () {
        this.bigBoss = new BigBoss(this, x, y - 200).setScale(x * 0.005);
        // this.enemiesArray.push(this.bigBoss);
        this.physics.add.collider(this.bigBoss, this.wallPlatform);
        this.physics.add.collider(this.bigBoss, this.firstLayer);
        this.physics.add.overlap(
          this.player,
          this.bigBoss,
          this.player.hitSpawn,
          null,
          this
        );
        this.physics.add.collider(this.player, this.bigBoss);
      },
      callbackScope: this,
      loop: false,
    });

    //healthHearts spawning every 10 seconds
    this.time.addEvent({
      delay: 8000,
      callback: this.spawnHearts,
      callbackScope: this,
      loop: true,
    });

    //fire raining down
    this.time.addEvent({
      delay: 4000,
      callback: this.spawnFire,
      callbackScope: this,
      loop: true,
    });

    //Set collision between lisa and fire from big boss
    this.physics.add.collider(this.player, this.fireGroup, () => {
      this.player.hitSpawn;
    });

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

    if (this.bigBoss && this.fadeTriggered === false) {
      this.bigBoss.update();
      if (this.bigBoss.hp <= 0) {
        this.fadeTriggered = true;
        this.cameras.main.fadeOut(2000, 255, 255, 255);
        this.cameras.main.once(
          Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
          (cam, effect) => {
            this.fadeTriggered = false;
            this.bigBoss = undefined;
            this.scene.start('Last', {
              music: data.music,
              hp: this.player.hp,
              score: this.player.score,
              timer: this.timer,
            });
          }
        );
      }
    }
  }

  spawnFire() {
    this.fire = this.physics.add.group({
      key: 'fire',
      allowGravity: true,
    });
    this.fire.children.iterate(function (child) {
      child.setPosition(Phaser.Math.RND.between(0, 1600), 0);
    });
    this.physics.add.overlap(
      this.player,
      this.fire,
      this.player.hitSpawn,
      null,
      this
    );
  }

  spawnHearts() {
    this.hearts = this.physics.add.group({
      key: 'heart',
      allowGravity: false,
    });
    this.hearts.children.iterate(function (child) {
      child.setPosition(
        Phaser.Math.RND.between(0, 2000),
        Phaser.Math.RND.between(400, 600)
      );
      child.setOrigin(0, 0);
    });
    this.physics.add.overlap(
      this.player,
      this.hearts,
      this.player.collectHeart,
      null,
      this
    );
  }

  gameOver(data) {
    this.scene.start('GameOver', {
      music: data.music,
      hp: this.player.hp,
      score: this.player.score,
      timer: this.timer,
    });
  }

  shakeCameras() {
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.cameras.main.shake(1000);
      },
      callbackScope: this,
    });
    this.time.addEvent({
      delay: 5000,
      callback: () => {
        this.cameras.main.shake(1000);
      },
      callbackScope: this,
    });
  }
}

export default BossFight;

import { Scene } from 'phaser';
import { Lisa } from '../sprites/Lisa.js';

class FallingSceneOne extends Scene {
  cameras;
  constructor() {
    super({ key: 'FallingSceneOne' });
  }

  create() {
    // Creating Player (Lisa)

    //Background - First Scene
    this.map = this.make.tilemap({ key: 'tilemapFallingSceneOne' });
    this.waterAndRockTileset = this.map.addTilesetImage(
      'water_and_rock',
      'tiles'
    );

    this.textureTwoTileset = this.map.addTilesetImage(
      'textures_2',
      'texturesTwo'
    );

    this.groundLayer = this.map.createLayer(
      'water_layer',
      this.waterAndRockTileset,
      0,
      0
    );

    this.texturesTwoLayer = this.map.createLayer(
      'texture_2_layer',
      this.textureTwoTileset,
      0,
      0
    );
    this.physics.add.collider(this.player, this.groundLayer);
    this.groundLayer.setCollisionBetween(95, 99);
    this.physics.add.collider(this.player, this.texturesTwoLayer);
    this.texturesTwoLayer.setCollisionBetween(1000, 1250);

    //PARALLAX EFFECT
    // this.stars = this.add
    //   .tileSprite(0, 0, innerWidth, innerHeight, 'shiny_stars')
    //   .setOrigin(0, 0)
    //   .setScrollFactor(0);

    // this.waterAndRock = this.add
    //   .tileSprite(0, 0, innerWidth, innerHeight, 'water_layer')
    //   .setOrigin(0, 0)
    //   .setScrollFactor(0);

    // this.textureOne = this.add
    //   .tileSprite(0, 0, innerWidth, innerHeight, 'texture_1_layer')
    //   .setOrigin(0, 0)
    //   .setScrollFactor(0);

    // this.textureTwo = this.add
    //   .tileSprite(0, 0, innerWidth, innerHeight, 'texture_2_layer')
    //   .setOrigin(0, 0)
    //   .setScrollFactor(0);

    // this.myCam = this.cameras.main;
    // this.myCam.setBounds(0, 0, innerWidth * 3, innerHeight);

    this.player = new Lisa(this, 695, 0).setOrigin(0, 0);
    // making the camera follow the player
    // this.myCam.startFollow(this.player);

    // this.physics.add.collider(this.player, this.textureTwo);
  }

  update() {
    this.player.update();

    // this.waterAndRock.tilePositionY = this.myCam.scrollX;
    // this.stars.tilePositionY = this.myCam.scrollX * 0.6;
    // this.textureTwo.tilePositionY = this.myCam.scrollX * 0.3;
  }
}

export default FallingSceneOne;

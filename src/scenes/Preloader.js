import Phaser from 'phaser';

export default class PreloaderScene extends Phaser.Scene {
  music;

  constructor() {
    super('Preloader');
  }

  preload() {
    this.loadText = this.add.text(
      innerWidth * 0.05,
      innerHeight * 0.95,
      'Loading... ',
      {
        fontSize: '24px',
        fill: '#FFFFFF',
        fontStyle: 'italic',
      }
    );

    // Sounds
    this.load.audio('fire', '/assets/audios/sounds/flamethrower.mp3');

    // Music
    this.load.audio('main-menu', '/assets/audios/music/main-menu-music.mp3');
    // this.load.audio('fight', '/assets/audios/music/fight-music.mp3');
    // this.load.audio('boss', '/assets/audios/music/boss-music.mp3');

    //Backgrounds
    this.load.image('sky', '/assets/menu/sky.png');
    this.load.image('sun', '/assets/backgrounds/Themy/First-Fight/sun.png');
    this.load.image('shiny_stars', '/assets/backgrounds/shiny_stars.png');

    //Menu
    this.load.image('play-red', '/assets/menu/play-button-red.png');
    this.load.image('play-white', '/assets/menu/play-button.png');
    this.load.image('high-score-white', '/assets/menu/high-score.png');
    this.load.image('high-score-red', '/assets/menu/high-score-red.png');
    this.load.image('main-menu', '/assets/menu/main-menu-white.png');
    this.load.image('credits', '/assets/menu/credits_white.png');
    this.load.image('credits-white', '/assets/menu/credits-white.png');
    this.load.image('credits-red', '/assets/menu/credits-red.png');

    //Credits
    this.load.image('bubble', '/assets/credits/bubble.png');

    //Intro
    this.load.image('letsGo-white', '/assets/menu/lets-go-white.png');
    this.load.image('letsGo-red', '/assets/menu/lets-go-red.png');

    //Form
    this.load.html('form', '/assets/text/inputForm.html');

    //HighScores
    this.load.bitmapFont(
      'arcade',
      '/assets/fonts/joystix.png',
      '/assets/fonts/joystix.xml'
    );

    // Testing assets
    this.load.image('test', '/assets/testSprites/platform.png');
    this.load.image('test2', '/assets/testSprites/platformRotate.png');

    // GameDev Sprites
    this.load.image('lauren', '/assets/gamedevs/lauren-idle1.png');
    this.load.image('jags', '/assets/gamedevs/jags-idle2.png');
    this.load.image('sheyla', '/assets/gamedevs/sheyla-idle2.png');
    this.load.image('naomi', '/assets/gamedevs/naomi-idle.png');

    // Lisa
    this.load.spritesheet('lisa', '/assets/lisa/default/lisa-spritesheet.png', {
      frameWidth: 36,
      frameHeight: 36,
    });

    // Tori
    this.load.spritesheet('tori', '/assets/lisa/alt/lisa-alt-run.png', {
      frameWidth: 80,
      frameHeight: 48,
    });

    // enemy1
    this.load.spritesheet('bot', '/assets/bot/reaperbot-sheet-alpha.png', {
      frameWidth: 42,
      frameHeight: 44,
    });

    // enemy2
    this.load.spritesheet(
      'grenadeGuy',
      '/assets/grenadeGuy/grenade-guy-sheet-alpha.png',
      {
        frameWidth: 36,
        frameHeight: 32,
      }
    );

    // enemy3
    this.load.spritesheet(
      'bigBoss',
      '/assets/bigBoss/enemies2-sheet-alpha.png',
      {
        frameWidth: 54,
        frameHeight: 58,
      }
    );

    // door sprite
    this.load.spritesheet('portal', '/assets/portalRings2.png', {
      frameWidth: 32,
      frameHeight: 28,
    });

    // door sprite 2
    this.load.spritesheet('portal2', '/assets/portalsSpriteSheet (1).png', {
      frameWidth: 45,
      frameHeight: 32,
    });

    //Game Scene

    this.load.image('tiles', '/assets/backgrounds/Themy/Scene-Main/tiles.png');

    this.load.image(
      'vegetation1',
      '/assets/backgrounds/Themy/Scene-Main/vegetation1.png'
    );
    this.load.image(
      'vegetation2',
      '/assets/backgrounds/Themy/Scene-Main/vegetation_2.png'
    );

    this.load.tilemapTiledJSON(
      'tilemap',
      '/assets/backgrounds/Themy/Scene-Main/Scene_Main.json'
    );

    //Falling Scenes

    this.load.tilemapTiledJSON(
      'tilemapFallingSceneOne',
      '/assets/backgrounds/Themy/Falling-Scene/One/Falling-Scene(one).json'
    );

    this.load.tilemapTiledJSON(
      'tilemapFallingSceneTwo',
      '/assets/backgrounds/Themy/Falling-Scene/Two/Falling-Scene(two).json'
    );

    this.load.image(
      'texturesTwo',
      '/assets/backgrounds/Themy/Falling-Scene/textures_2.png'
    );

    //First fight

    this.load.tilemapTiledJSON(
      'tilemap_FF',
      '/assets/backgrounds/Themy/First-Fight/Start/First_Fight.json'
    );

    //Second Fight

    this.load.tilemapTiledJSON(
      'tilemap_FF2',
      '/assets/backgrounds/Themy/First-Fight/Part_Two/First_Fight(2).json'
    );

    //Third fight

    this.load.tilemapTiledJSON(
      'tilemap_FF3',
      'assets/backgrounds/Themy/First-Fight/Part_Three/First_Fight(3)(Final).json'
    );

    this.load.image(
      'mechanical',
      '/assets/backgrounds/Themy/First-Fight/Part_Three/Mechanical_tiles.png'
    );

    this.load.image(
      'security_cam',
      'assets/backgrounds/Themy/First-Fight/Part_Three/cameras.png'
    );

    //Boss fight
    this.load.tilemapTiledJSON(
      'tilemap_BF',
      '/assets/backgrounds/Themy/First-Fight/Boss-Fight/Boss-Fight.json'
    );

    this.load.image(
      'boss_tileset1',
      '/assets/backgrounds/Themy/First-Fight/Boss-Fight/boss_tileset1.png'
    );
    this.load.image(
      'boss_tileset2',
      '/assets/backgrounds/Themy/First-Fight/Boss-Fight/boss_tileset2.png'
    );
    this.load.image(
      'boss_tileset3',
      '/assets/backgrounds/Themy/First-Fight/Boss-Fight/boss_tileset3.png'
    );

    //Promised land

    this.load.tilemapTiledJSON(
      'tilemapPromisedLand',
      '/assets/backgrounds/Themy/Promised-Lands/First-Promised-Land.json'
    );

    this.load.image('phone', '/assets/accessories/phone.png');

    //Game over
    this.load.image('gameOver', '/assets/announcements/game-over.png');

    //heart
    this.load.image('heart', '/assets/heart.png');

    // fire
    this.load.image('fire', '/assets/bigBoss/fire.png');

    //oilRig
    this.load.image('rig', '/assets/oilRig.png');

    // laser
    this.load.image('laser', '/assets/lisa/default/laser4.png');
  }

  createLisaAnims() {
    this.anims.create({
      key: 'idle',
      frames: [{ key: 'lisa', frame: 0 }],
      frameRate: 12,
    });
    this.anims.create({
      key: 'rising',
      frames: [{ key: 'lisa', frame: 47 }],
      frameRate: 12,
    });
    this.anims.create({
      key: 'falling',
      frames: [{ key: 'lisa', frame: 2 }],
      frameRate: 12,
    });
    this.anims.create({
      key: 'dash',
      frames: this.anims.generateFrameNumbers('lisa', { start: 3, end: 7 }),
      frameRate: 20,
    });
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('lisa', { start: 8, end: 15 }),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: 'super-punch',
      frames: this.anims.generateFrameNumbers('lisa', { start: 16, end: 32 }),
      frameRate: 18,
    });
    this.anims.create({
      key: 'punch',
      frames: this.anims.generateFrameNumbers('lisa', { start: 33, end: 36 }),
      frameRate: 18,
    });
    this.anims.create({
      key: 'shoot',
      frames: this.anims.generateFrameNumbers('lisa', { start: 37, end: 46 }),
      frameRate: 18,
    });
  }

  createEnemyAnims() {
    this.anims.create({
      key: 'flyguy-idle',
      frames: this.anims.generateFrameNumbers('bot', { start: 18, end: 25 }),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: 'grenadeRun',
      frames: this.anims.generateFrameNumbers('grenadeGuy', {
        start: 8,
        end: 15,
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: 'bigBossWalk',
      frames: this.anims.generateFrameNumbers('bigBoss', {
        start: 0,
        end: 5,
      }),
      frameRate: 12,
      repeat: -1,
    });
  }

  createDoorAnims() {
    this.anims.create({
      key: 'portalPlay',
      frames: this.anims.generateFrameNumbers('portal', {
        start: 0,
        end: 4,
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: 'portalPlay2',
      frames: this.anims.generateFrameNumbers('portal2', {
        start: 0,
        end: 3,
      }),
      frameRate: 12,
      repeat: -1,
    });
  }

  create() {
    this.music = this.sound.add('main-menu');
    this.musicConfig = {
      mute: 0,
      volume: 0.35,
      loop: true,
    };

    this.createLisaAnims();
    this.createEnemyAnims();
    this.createDoorAnims();

    this.loadText.setText('Loading... Complete: click here to begin.');
    this.loadText.setInteractive();

    this.loadText.on('pointerup', () => {
      this.start();
    });
  }

  start() {
    // Need user input for music so I've tied it with starting the game... don't ask :(
    this.music.play(this.musicConfig);
    this.scene.start('MainMenu', {
      music: this.music,
    });
  }
}

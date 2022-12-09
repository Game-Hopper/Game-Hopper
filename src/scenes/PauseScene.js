import { Scene } from 'phaser';

class PauseScene extends Scene {
  music;

  constructor() {
    super({ key: 'PauseScene' });
  }

  create(data) {
    const x = innerWidth / 2;
    const y = innerHeight / 2;
    this.background = this.add.image(x, y, 'shiny_stars');
    this.background.displayWidth = this.sys.canvas.width;
    this.background.displayHeight = this.sys.canvas.height;

    let resumeButton = this.add
      .text(x, innerHeight / 10, 'RESUME PLAY')
      .setScale(2);

    resumeButton.setInteractive();

    resumeButton.on('pointerup', () => {
      console.log('resume button pressed');

      this.scene.launch('GameScene');
      this.scene.resume('GameScene');
      // this.scene.start('GameScene');
    });
  }
}

export default PauseScene;

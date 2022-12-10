import axios from 'axios';
import store from '../store';
import { fetchScores } from '../store/redux/scoresReducer';
import { Scene } from 'phaser';
import WebFontFile from '../helpers/fontLoader';

class GameOver extends Scene {
  player;

  constructor(data) {
    super({ key: 'GameOver' });
  }

  preload() {
    this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'));
  }

  create(data) {
    const x = innerWidth / 2;
    const y = innerHeight / 2;

    this.background = this.add.image(x, y, 'shiny_stars');
    this.background.displayWidth = this.sys.canvas.width;
    this.background.displayHeight = this.sys.canvas.height;

    //Game over png
    this.add.image(x, y - 150, 'gameOver').setScale(4);

    const score = data.score || 0;
    this.scoreText = this.add.text(
      innerWidth * 0.05,
      innerHeight * 0.05,
      'Score: ' + score,
      {
        fontFamily: '"Press Start 2P"',
        fontSize: '32px',
        fill: '#E43AA4',
      }
    );

    this.addScore = this.add
      .text(x - 230, y + 95, 'Type up to four letters\n to save your score!', {
        fontFamily: '"Press Start 2P"',
        fontSize: '20px',
      })
      .setOrigin(0, 0);

    let mainMenuButton = this.add
      .image(x / 2, y * 1.8, 'main-menu')
      .setScale(1.5);
    mainMenuButton.setInteractive();
    mainMenuButton.on('pointerup', () => {
      this.scene.start('MainMenu');
    });

    this.ouchieText = this.add.text(x - 250, y - 200, '').setScale(1.25);
    this.typewriteText(data.defeatText);

    const element = this.add.dom(x, y + 170).createFromCache('form');

    element.setPerspective(300);
    element.addListener('change');

    element.on('change', async (evt) => {
      if (evt.target.name === 'username') {
        let username = evt.target.value;
        this.addScore.setText('Welcome ' + username);
        await axios.post('/api/scores', {
          name: username,
          score: data.score || 0,
        });
        store.dispatch(fetchScores());
      }
    });
  }

  typewriteText(text) {
    const length = text.length;
    let i = 0;
    this.time.addEvent({
      callback: () => {
        this.ouchieText.text += text[i];
        i++;
      },
      repeat: length - 1,
      delay: 30,
    });
  }
}

export default GameOver;

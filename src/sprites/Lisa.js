import { Sprite } from 'phaser';

export class Lisa extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'lisa');

    // For Health Bar?
    // this.aura = this.scene.add.sprite(this.body.x, this.body.y, 'hp_block');

    this.play('idle');
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    // player Config
    this.setScale(x / 180);
    this.body.setGravityY(450);
    this.body.setCollideWorldBounds(true);

    //Method calls for creation
    this.init();
    this.create();

    console.log('the big lisa: ', this);
  }

  init() {
    //Variables
    this.is_run = false;
    this.is_idle = false;
    this.is_dash = false;
    this.is_punch = false;
    this.is_in_knockback = false;
    this.is_shoot = false;

    this.has_air_jump = false;
    this.can_dash = true;

    this.current_knockback_speed = 0;
    this.hp = 10;
    this.colliderPunch;
    this.cursors;
    this.explosion;

    // Score
    this.score = 0;
    this.scoreText = this.scene.add.text(
      this.x * 0.1,
      this.y * 0.1,
      'score: 0',
      {
        fontSize: '32px',
        fill: '#E43AA4',
      }
    );
  }

  create() {
    // Create Input Event
    this.cursors = this.scene.input.keyboard;

    // Look in this function, after one animation is completed
    this.on('animationcomplete', (event) => {
      try {
        if (
          event.key == 'punch' ||
          event.key == 'super-punch' ||
          event.key == 'dash' ||
          event.key == 'shoot'
        ) {
          this.anims.play('idle', true);
          this.is_punch = false;
          this.is_dash = false;
          this.is_shoot = false;
          this.colliderPunch.destroy(true);
        }
      } catch (e) {}
    });

    // key objects
    this.cursors.keyobj_z = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.Z
    );
    this.cursors.keyobj_x = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.X
    );
    this.cursors.keyobj_c = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.C
    );
    this.cursors.keyobj_up = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.UP
    );
    this.cursors.keyobj_down = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN
    );
    this.cursors.keyobj_left = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );
    this.cursors.keyobj_right = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.cursors.keyobj_shift = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );
  }

  update() {
    // Move Left
    if (this.cursors.keyobj_left.isDown) {
      if (!this.is_punch && !this.is_dash && !this.is_shoot) {
        this.body.setVelocityX(-500);
        if (
          (this.body.blocked.down || this.body.touching.down) &&
          !this.anims.isPlaying
        ) {
          this.anims.play('run');
        }

        this.flipX = true;
      }

      // Move Right
    } else if (this.cursors.keyobj_right.isDown) {
      if (!this.is_punch && !this.is_dash && !this.is_shoot) {
        this.body.setVelocityX(500);
        if (
          (this.body.blocked.down || this.body.touching.down) &&
          !this.anims.isPlaying
        ) {
          this.anims.play('run');
        }

        this.flipX = false;
      }

      // Idle
    } else {
      if (!this.is_punch && !this.is_dash && !this.is_shoot) {
        this.body.setVelocityX(0);

        this.anims.play('idle', true);
      }
    }

    //Knockback
    if (this.is_in_knockback) {
      if (this.current_knockback_speed <= 0) {
        this.is_in_knockback = false;
      }
      this.body.setVelocityX(
        this.body.velocity.x + this.current_knockback_speed
      );
      this.current_knockback_speed -= 5;
    }

    // Grounded Jump
    if (Phaser.Input.Keyboard.JustDown(this.cursors.keyobj_up)) {
      this.body.setVelocityY(-450);
    }

    // Aerial Jump
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.keyobj_up) &&
      (!this.body.blocked.down || !this.body.touching.down)
    ) {
      this.body.setVelocityY(-250);
      this.has_air_jump = false;
    }

    // Rising
    if (
      (!this.body.blocked.down || !this.body.touching.down) &&
      this.body.velocity.y < 0
    ) {
      this.anims.play('rising');
    }

    // Falling
    if (
      (!this.body.blocked.down || !this.body.touching.down) &&
      this.body.velocity.y > 0
    ) {
      this.anims.play('falling');
    }

    // Fast-falling
    if (this.cursors.keyobj_down.isDown && this.body.velocity.y < 100) {
      this.body.setVelocityY(400);
    }

    // Ground Dash
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.keyobj_c) &&
      this.can_dash &&
      (this.body.blocked.down || this.body.touching.down)
    ) {
      this.can_dash = false;
      this.dashAnimation();
    }

    // Re-enable dash
    if (!Phaser.Input.Keyboard.DownDuration(this.cursors.keyobj_c, 500)) {
      this.can_dash = true;
    }

    // Super-Punch
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.keyobj_x) &&
      (this.body.blocked.down || this.body.touching.down) &&
      !this.is_punch &&
      !this.is_dash &&
      !this.is_shoot
    ) {
      this.attackAnimation('super-punch');
    }

    // Punch
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.keyobj_z) &&
      (this.body.blocked.down || this.body.touching.down) &&
      !this.is_punch &&
      !this.is_dash &&
      !this.is_shoot
    ) {
      this.attackAnimation('punch');
    }

    // Shoot
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.keyobj_shift) &&
      (this.body.blocked.down || this.body.touching.down) &&
      !this.is_punch &&
      !this.is_dash &&
      !this.is_shoot
    ) {
      console.log('shift detected');
      // this.anims.play('shoot');
      this.shootAnimation('shoot');
    }

    // Reset Jumps
    if (this.body.blocked.down || this.body.touching.down) {
      this.has_air_jump = true;
    }
  }

  attackAnimation(attack) {
    this.is_punch = true;

    this.hitbox = this.scene.add
      .sprite(this.x, this.y - this.body.height / 2)
      .setDepth(-1)
      .setScale(0.2)
      .setAngle(this.flipX ? -45 : 45);

    this.anims.play(attack);

    if (attack === 'super-punch') {
      this.flipX
        ? this.body.setVelocityX(-200) && this.attackCalculation(-800)
        : this.body.setVelocityX(200) && this.attackCalculation(800);
    }
    if (attack === 'punch') {
      this.flipX
        ? this.body.setVelocityX(-300) && this.attackCalculation(-400)
        : this.body.setVelocityX(300) && this.attackCalculation(400);
    }

    this.hitbox.once('animationcomplete', () => {
      this.hitbox.destroy();
    });
  }

  shootAnimation(attack) {
    this.is_shoot = true;

    this.hitbox = this.scene.add
      .sprite(this.x, this.y - this.body.height / 2)
      .setDepth(-1)
      .setScale(0.2)
      .setAngle(this.flipX ? -45 : 45);

    this.anims.play(attack);

    this.hitbox.once('animationcomplete', () => {
      this.hitbox.destroy();
    });

    this.colliderPunch = this.scene.add.rectangle(
      this.flipX ? this.x - this.x * 0.1 : this.x + this.x * 0.1,
      this.y,
      60,
      60
    );
  }

  attackCalculation(knockbackVal) {
    // calculating hitbox by attack
    this.colliderPunch = this.scene.add.rectangle(
      this.flipX ? this.x - this.x * 0.1 : this.x + this.x * 0.1,
      this.y,
      60,
      60
    );

    this.scene.physics.add.existing(this.colliderPunch);
    this.colliderPunch.body.setImmovable(true);
    this.colliderPunch.body.allowGravity = false;

    if (this.scene.physics.overlap(this.scene.enemy, this.colliderPunch)) {
      this.scene.enemy.is_in_knockback = true;
      this.scene.enemy.current_knockback_speed = knockbackVal;
      this.scene.enemy.body.setVelocityX(knockbackVal);

      // Knockingback enemy
      if (knockbackVal <= 0) {
        this.scene.enemy.body.setVelocityY(knockbackVal / 1.8);
      } else {
        this.scene.enemy.body.setVelocityY(knockbackVal / -1.8);
      }

      // HP and Score
      if (this.scene.enemy.hp >= 0) {
        this.scene.enemy.hp--;

        if (knockbackVal <= 0) {
          this.addScore(knockbackVal * -0.05);
        } else {
          this.addScore(knockbackVal * 0.05);
        }
      } else if (this.scene.enemy.hp <= 0) {
        this.scene.enemy.destroy();
        this.addScore(100);
      }

      if (this.colliderPunch) this.colliderPunch.destroy();
    }
  }

  dashAnimation() {
    this.is_dash = true;
    this.anims.play('dash');
    this.flipX ? this.body.setVelocityX(-1200) : this.body.setVelocityX(1200);
  }

  addScore(num) {
    this.score += num;
    this.scoreText.setText('Score:' + this.score);
  }
}

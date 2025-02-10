import Phaser from 'phaser';
import type { Reward } from '../../../types';

export default class RewardAndAttentionModal extends Phaser.GameObjects.Container {
  private confettiGroup: Phaser.GameObjects.Image[] = [];
  private confettiTimers: Phaser.Time.TimerEvent[] = [];

  constructor(
    scene: Phaser.Scene,
    reward: Reward | null,
    // Параметр на случай использования модалки для уведомления о закончившихся попытках
    isOutOfAttempts = false,
  ) {
    super(scene, 0, 0);
    scene.add.existing(this);

    // Полупрозрачный фон
    const background = scene.add.graphics();
    background.fillStyle(0x000000, 0.8);
    background.fillRect(0, 0, scene.cameras.main.width, scene.cameras.main.height);
    background.setInteractive(
      new Phaser.Geom.Rectangle(
        0,
        0,
        scene.cameras.main.width,
        scene.cameras.main.height,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    background.on('pointerdown', () => this.closeModal());
    this.add(background);

    if (reward && !isOutOfAttempts) {
      // Анимация конфетти
      this.spawnConfetti(scene);

      // Вращающееся сияние в центре
      const shining = scene.add.image(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY,
        'shining_golden',
      );
      this.add(shining);
      scene.tweens.add({
        targets: shining,
        angle: 360,
        duration: 16000,
        repeat: -1,
        ease: 'Linear',
      });

      // Украшение сверху
      const victoryImage = scene.add.image(
        scene.cameras.main.centerX,
        169,
        'victory_window',
      );
      this.add(victoryImage);

      // Название награды
      const rewardName = scene.add
        .text(scene.cameras.main.centerX, 282, reward.name, {
          fontSize: '42px',
          color: '#FFFFFF',
          fontFamily: 'Baloo',
        })
        .setOrigin(0.5);
      this.add(rewardName);

      // Изображение награды
      const rewardImage = scene.add
        .image(scene.cameras.main.centerX, scene.cameras.main.centerY, reward.image)
        .setScale(2.5);
      this.add(rewardImage);

      // Количество
      const rewardAmount = scene.add
        .text(
          scene.cameras.main.centerX,
          scene.cameras.main.centerY + 139,
          `${reward.amount}`,
          {
            fontSize: '42px',
            color: '#FFFFFF',
            fontFamily: 'SFCompactRounded',
            fontStyle: 'bold',
          },
        )
        .setOrigin(0.5)
        .setStroke('#00377D', 6);
      this.add(rewardAmount);
    } else {
      // Текстовое сообщение в центре (для пустого слота или окончания попыток)
      const messageText = isOutOfAttempts
        ? 'У вас закончились\nпопытки'
        : 'Вы ничего не\nвыиграли. Повезет в\nследующий раз';

      const centerText = scene.add
        .text(scene.cameras.main.centerX, scene.cameras.main.centerY, messageText, {
          fontSize: '32px',
          color: '#FFFFFF',
          fontFamily: 'SFCompactRounded',
          fontStyle: 'bold',
          align: 'center',
        })
        .setOrigin(0.5)
        .setStroke('#00377D', 6);
      this.add(centerText);
    }

    // Надпись о возможности закрытия
    const closeText = scene.add
      .text(
        scene.cameras.main.centerX,
        scene.cameras.main.height - 71,
        'Нажмите, чтобы продолжить',
        {
          fontSize: '28px',
          color: '#FFFFFF',
          fontFamily: 'SFCompactRounded',
          fontStyle: 'bold',
        },
      )
      .setOrigin(0.5)
      .setStroke('#00377D', 6);
    closeText.setInteractive();
    closeText.on('pointerdown', () => this.closeModal());
    this.add(closeText);
  }

  private spawnConfetti(scene: Phaser.Scene) {
    const screenWidth = scene.cameras.main.width;
    const screenHeight = scene.cameras.main.height;

    // Определяем количество конфетти по ширине экрана
    const halfScreen = screenWidth / 2;
    let confettiCount = Phaser.Math.Linear(
      9,
      18,
      Phaser.Math.Clamp((halfScreen - 350) / (900 - 350), 0, 1),
    );
    confettiCount = Math.round(confettiCount);

    for (let i = 0; i < confettiCount; i++) {
      const delay = i * Phaser.Math.Between(150, 300);

      // Слева
      const leftTimer = scene.time.delayedCall(delay, () => {
        this.createConfetti(
          scene,
          Phaser.Math.Between(-100, halfScreen - 90),
          screenHeight,
        );
      });
      this.confettiTimers.push(leftTimer);

      // Справа
      const rightTimer = scene.time.delayedCall(delay, () => {
        this.createConfetti(
          scene,
          Phaser.Math.Between(halfScreen + 90, screenWidth + 100),
          screenHeight,
        );
      });
      this.confettiTimers.push(rightTimer);
    }
  }

  private createConfetti(scene: Phaser.Scene, x: number, screenHeight: number) {
    const confettiTextures = ['confetti_1', 'confetti_2', 'confetti_3', 'confetti_4'];
    const texture = Phaser.Math.RND.pick(confettiTextures);
    const confetti = scene.add.image(x, -Phaser.Math.Between(50, 100), texture);
    confetti.setScale(Phaser.Math.FloatBetween(0.5, 1));
    this.confettiGroup.push(confetti);

    // Движение вниз с покачиванием
    const fallTween = scene.tweens.add({
      targets: confetti,
      y: screenHeight + 50,
      x: x + Phaser.Math.Between(-100, 100),
      duration: Phaser.Math.Between(3000, 5000),
      ease: 'Linear',
      repeat: -1,
      onRepeat: () => {
        confetti.y = -Phaser.Math.Between(50, 100);
        confetti.x = x + Phaser.Math.Between(-100, 100);
      },
    });

    // Качание по X
    const swingTween = scene.tweens.add({
      targets: confetti,
      x: confetti.x + Phaser.Math.Between(-30, 30),
      duration: Phaser.Math.Between(1000, 1500),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    confetti.setData('fallTween', fallTween);
    confetti.setData('swingTween', swingTween);
  }

  private closeModal() {
    // Останавливаем таймеры
    this.confettiTimers.forEach((timer) => timer.remove());
    this.confettiTimers = [];

    // Удаляем конфетти и их анимации
    this.confettiGroup.forEach((confetti) => {
      const fallTween = confetti.getData('fallTween');
      const swingTween = confetti.getData('swingTween');
      if (fallTween) fallTween.stop();
      if (swingTween) swingTween.stop();
      confetti.destroy();
    });
    this.confettiGroup = [];

    // Уничтожаем саму модалку
    this.destroy(true);
  }
}

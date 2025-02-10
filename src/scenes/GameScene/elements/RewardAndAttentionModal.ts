import Phaser from 'phaser';
import type { Reward } from '../../../types';
import { findScale } from '../../../utils';

export default class RewardAndAttentionModal extends Phaser.GameObjects.Container {
  private confettiGroup: Phaser.GameObjects.Image[] = [];
  private confettiTimers: Phaser.Time.TimerEvent[] = [];
  private onCloseModal?: () => void;
  private background!: Phaser.GameObjects.Graphics;
  private shining!: Phaser.GameObjects.Image;
  private victoryImage!: Phaser.GameObjects.Image;
  private rewardName!: Phaser.GameObjects.Text;
  private rewardImage!: Phaser.GameObjects.Image;
  private rewardAmount!: Phaser.GameObjects.Text;
  private centerText!: Phaser.GameObjects.Text;
  private closeText!: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    reward: Reward | null,
    // Параметр на случай использования модалки для уведомления о закончившихся попытках
    isOutOfAttempts = false,
    onCloseModal?: () => void,
  ) {
    super(scene, 0, 0);
    scene.add.existing(this);
    if (onCloseModal) {
      this.onCloseModal = onCloseModal;
    }

    // Полупрозрачный фон
    this.background = scene.add.graphics();
    this.background.fillStyle(0x000000, 0.8);
    this.background.fillRect(0, 0, scene.cameras.main.width, scene.cameras.main.height);
    this.background.setInteractive(
      new Phaser.Geom.Rectangle(
        0,
        0,
        scene.cameras.main.width,
        scene.cameras.main.height,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    this.background.on('pointerdown', () => this.closeModal());
    this.add(this.background);

    if (reward && !isOutOfAttempts) {
      // Анимация конфетти
      this.spawnConfetti(scene);

      // Вращающееся сияние в центре
      this.shining = scene.add.image(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY,
        'shining_golden',
      );
      this.add(this.shining);
      scene.tweens.add({
        targets: this.shining,
        angle: 360,
        duration: 16000,
        repeat: -1,
        ease: 'Linear',
      });

      // Украшение сверху
      this.victoryImage = scene.add.image(
        scene.cameras.main.centerX,
        0,
        'victory_window',
      );
      this.add(this.victoryImage);

      // Название награды
      this.rewardName = scene.add
        .text(
          scene.cameras.main.centerX,
          this.victoryImage.displayHeight * 0.83,
          reward.name,
          {
            fontSize: '42px',
            color: '#FFFFFF',
            fontFamily: 'Baloo',
          },
        )
        .setOrigin(0.5);
      this.add(this.rewardName);

      // Изображение награды
      this.rewardImage = scene.add
        .image(scene.cameras.main.centerX, scene.cameras.main.centerY, reward.image)
        .setScale(2.5);
      this.add(this.rewardImage);

      // Количество
      this.rewardAmount = scene.add
        .text(
          scene.cameras.main.centerX,
          scene.cameras.main.centerY + this.rewardImage.displayHeight,
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
      this.add(this.rewardAmount);
    } else {
      // Текстовое сообщение в центре (для пустого слота или окончания попыток)
      const messageText = isOutOfAttempts
        ? 'У вас закончились\nпопытки'
        : 'Вы ничего не\nвыиграли. Повезет в\nследующий раз';

      this.centerText = scene.add
        .text(scene.cameras.main.centerX, scene.cameras.main.centerY, messageText, {
          fontSize: '32px',
          color: '#FFFFFF',
          fontFamily: 'SFCompactRounded',
          fontStyle: 'bold',
          align: 'center',
        })
        .setOrigin(0.5)
        .setStroke('#00377D', 6);
      this.add(this.centerText);
    }

    // Надпись о возможности закрытия
    this.closeText = scene.add
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
    this.closeText.setInteractive();
    this.closeText.on('pointerdown', () => this.closeModal());
    this.add(this.closeText);

    // Применяем изменения для адаптивности
    const { targetScale } = findScale();

    this.updateAfterResizing(targetScale);
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

  public updateAfterResizing(targetScale: number) {
    const { width, height } = this.scene.scale;

    // Обновляем фон
    this.background.clear();
    this.background.fillStyle(0x000000, 0.8);
    this.background.fillRect(0, 0, width, height);

    // Обновляем позицию и размер UI-элементов
    if (this.shining)
      this.shining.setPosition(width / 2, height / 2).setScale(targetScale);

    if (this.victoryImage) {
      this.victoryImage.setScale(targetScale);
      this.victoryImage.setPosition(width / 2, this.victoryImage.displayHeight / 2);
    }

    if (this.rewardName)
      this.rewardName
        .setPosition(width / 2, this.victoryImage.displayHeight * 0.83)
        .setScale(targetScale);

    if (this.rewardImage)
      this.rewardImage.setPosition(width / 2, height / 2).setScale(2.5 * targetScale);

    if (this.rewardAmount)
      this.rewardAmount
        .setPosition(width / 2, height / 2 + this.rewardImage.displayHeight)
        .setScale(targetScale);

    if (this.centerText)
      this.centerText.setPosition(width / 2, height / 2).setScale(targetScale);

    if (this.closeText)
      this.closeText.setPosition(width / 2, height - 71).setScale(targetScale);
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

    this.onCloseModal?.();

    // Уничтожаем саму модалку
    this.destroy(true);
  }
}

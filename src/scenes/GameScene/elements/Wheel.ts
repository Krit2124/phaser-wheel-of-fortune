import Phaser from 'phaser';
import type { Reward } from '../../../types';

export default class Wheel extends Phaser.GameObjects.Container {
  private sectors: Phaser.GameObjects.Graphics;
  private sliceAngle: number;
  private isSpinning: boolean = false;
  private pointer!: Phaser.GameObjects.Image;
  private shining!: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private segments: Reward[],
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.sectors = scene.add.graphics();
    this.sliceAngle = (2 * Math.PI) / this.segments.length;

    this.createAnimations();
    this.createBorders();
    this.createWheel();
  }

  private createAnimations() {
    // Вращающееся сияние в центре
    // (не добавляется в Wheel, чтобы не вращалось вместе с колесом)
    this.shining = this.scene.add.image(this.x, this.y, 'shining_blue');
    this.shining.setDepth(-10);
    this.scene.tweens.add({
      targets: this.shining,
      angle: 360,
      duration: 16000,
      repeat: -1,
      ease: 'Linear',
    });
  }

  private createBorders() {
    const borderGraphics = this.scene.add.graphics();
    borderGraphics.fillStyle(0x0d42c1, 1);
    borderGraphics.fillCircle(0, 0, 300);

    borderGraphics.fillStyle(0x003d6d, 1);
    borderGraphics.fillCircle(0, 0, 253);

    borderGraphics.fillStyle(0xc3d3fb, 1);
    borderGraphics.fillCircle(0, 0, 242);

    borderGraphics.lineStyle(2, 0x0d42c1);
    borderGraphics.strokeCircle(0, 0, 242);

    borderGraphics.fillStyle(0x0d42c1, 1);
    borderGraphics.fillCircle(0, 0, 228);

    this.add(borderGraphics);
  }

  private createWheel() {
    // Указатель
    // (не добавляется в Wheel, чтобы не вращался вместе с колесом)
    this.pointer = this.scene.add.image(this.x, this.y, 'pointer');

    // Отрисовка секторов
    for (let i = 0; i < this.segments.length; i++) {
      const angle = i * this.sliceAngle;
      const isWhiteBackground = i % 2 === 0;

      this.sectors.fillStyle(isWhiteBackground ? 0xc3d3fb : 0x0d42c1, 1);
      this.sectors.slice(0, 0, 227, angle, angle + this.sliceAngle, false);
      this.sectors.fillPath();
    }

    this.add(this.sectors);

    // Добавление текста и изображений
    for (let i = 0; i < this.segments.length; i++) {
      const angle = i * this.sliceAngle;

      const isWhiteBackground = i % 2 === 0;
      const hasImage = this.segments[i].image !== '';

      const textRadius = hasImage ? 105 : 145;
      const textX = Math.cos(angle + this.sliceAngle / 2) * textRadius;
      const textY = Math.sin(angle + this.sliceAngle / 2) * textRadius;

      const text = this.scene.add.text(textX, textY, this.segments[i].amount, {
        fontSize: this.segments[i].amount === 'Пусто' ? '32px' : '28px',
        color: isWhiteBackground ? '#0D42C1' : '#FFFFFF',
        fontFamily: 'Baloo',
      });
      text.setOrigin(0.5);
      text.setRotation(angle + 90);
      this.add(text);

      if (hasImage) {
        const imageRadius = 170;
        const imageX = Math.cos(angle + this.sliceAngle / 2) * imageRadius;
        const imageY = Math.sin(angle + this.sliceAngle / 2) * imageRadius;

        const prizeImage = this.scene.add.image(imageX, imageY, this.segments[i].image);
        prizeImage.setOrigin(0.5);
        prizeImage.setRotation(angle + 90);
        this.add(prizeImage);
      }
    }
  }

  public spinWheel() {
    if (this.isSpinning) return;
    this.isSpinning = true;

    // Запуск частиц во время вращения
    // (время создания частиц чуть меньше времени вращения,
    // так как им всё равно нужно время чтобы разлететься в стороны)
    this.startParticleEffect(3000);

    const randomSpins = Phaser.Math.Between(3, 5);
    const targetAngle = randomSpins * 360 + Phaser.Math.Between(0, 360);

    this.scene.tweens.add({
      targets: this,
      angle: targetAngle,
      duration: 4000,
      ease: 'Cubic.easeOut',
      onComplete: () => this.onSpinComplete(),
    });
  }

  // Функция для спавна синих частиц при вращении
  private startParticleEffect(duration: number) {
    // Интервал появления частиц
    const interval = Phaser.Math.Between(50, 80);
    // Сколько частиц появится за время вращения
    const maxParticles = Math.ceil(duration / interval);

    let count = 0;

    const particleTimer = this.scene.time.addEvent({
      delay: interval,
      repeat: maxParticles - 1, // Повторяем до конца анимации
      callback: () => {
        this.spawnParticle();
        count++;

        // Останавливаем, если колесо закончит крутиться
        if (count >= maxParticles) {
          particleTimer.remove();
        }
      },
    });
  }

  // Спавн одной синей частицы
  private spawnParticle() {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const distance = Phaser.Math.Between(500, 600);

    const particle = this.scene.add.image(this.x, this.y, 'spin_particle');
    particle.setDepth(-1).setScale(Phaser.Math.FloatBetween(15, 20));

    // Добавляем вращение частице
    this.scene.tweens.add({
      targets: particle,
      angle: Phaser.Math.Between(-180, 180),
      duration: 1000,
      ease: 'Linear',
    });

    // Анимация разлета
    this.scene.tweens.add({
      targets: particle,
      x: this.x + Math.cos(angle) * distance,
      y: this.y + Math.sin(angle) * distance,
      scaleX: 0.2,
      scaleY: 0.2,
      alpha: 0,
      duration: 1200,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        particle.destroy();
      },
    });
  }

  private onSpinComplete() {
    this.isSpinning = false;
    this.emit('spinComplete');
  }

  // Метод для получения индекса сегмента, на который указывает указатель
  public getCurrentSegmentIndex(): number {
    /* 
      При создании ячеек они отсчитываются от 90 градусов (или 3 часов, если сравнить с циферблатом) по часовой стрелке.
      При этом угол колеса отсчитывается от 0 (или 12 часов) против часовой стрелки.
      Следующий код нужен для того, чтобы эти углы сошлись
    */

    // Нормализуем угол в диапазон 0-360
    const normalizedAngle = ((this.angle % 360) + 360) % 360;

    // Инвертируем направление
    let adjustedAngle = (360 - normalizedAngle) % 360;

    // Сдвигаем угол на -90°
    adjustedAngle = (adjustedAngle - 90 + 360) % 360;

    // Вычисляем индекс сегмента
    const segmentWidth = 360 / this.segments.length;
    const index = Math.floor(adjustedAngle / segmentWidth);

    return index;
  }

  // Правила для масштабирования сияния и указателя
  // (они не масштабируются вместе с остальными элементами, так как не прикреплены к Wheel)
  public updateAfterResizing() {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;

    this.shining.setPosition(centerX, centerY);
    this.pointer.setPosition(centerX, centerY);
  }
}

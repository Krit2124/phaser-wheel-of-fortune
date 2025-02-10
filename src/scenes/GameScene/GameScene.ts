import Phaser from 'phaser';
import Wheel from './elements/Wheel';
import SpinButton from './elements/SpinButton';
import Header from './elements/Header';
import RewardAndAttentionModal from './elements/RewardAndAttentionModal';
import type { Reward } from '../../types';

export default class GameScene extends Phaser.Scene {
  private wheel!: Wheel;
  private segments: Reward[] = [
    { name: 'Монеты', amount: 'x25', image: 'coin' },
    { name: 'Пусто', amount: 'Пусто', image: '' },
    { name: 'Подарок 2 уровня', amount: 'x1', image: 'gift_2' },
    { name: 'Подарок 3 уровня', amount: 'x1', image: 'gift_3' },
    { name: 'Подарок 4 уровня', amount: 'x1', image: 'gift_4' },
    { name: 'Пусто', amount: 'Пусто', image: '' },
    { name: 'Подарок 1 уровня', amount: 'x1', image: 'gift_1' },
    { name: 'Звезды', amount: 'x10', image: 'star' },
  ];

  private header!: Header;
  private isSpinning: boolean = false;

  // Функция для адаптивного масштабирования
  private updateScale() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Вычисляем масштаб по высоте и ширине
    const scaleX = width < 630 ? Phaser.Math.Clamp(width / 630, 0.6, 1) : 1;
    const scaleY = height < 890 ? Phaser.Math.Clamp(height / 890, 0.6, 1) : 1;

    // Применяем минимальный из двух масштабов
    const targetScale = Math.min(scaleX, scaleY);

    // Масштабируем остальные элементы
    this.children.each((child: any) => {
      if (child.setScale && child !== this.header) {
        // Не меняем масштаб для шапки
        child.setScale(targetScale);
      }
    });
  }

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('pointer', '/assets/pointer.png');
    this.load.image('attempts_container', '/assets/attempts_container.png');
    this.load.image('victory_window', '/assets/victory_window.png');
    this.load.image('shining_golden', '/assets/shining_golden.png');
    this.load.image('shining_blue', '/assets/shining_blue.png');
    this.segments.forEach((segment) => {
      if (segment.image) {
        this.load.image(segment.image, `/assets/${segment.image}.png`);
      }
    });
    this.load.image('spin_particle', '/assets/spin_particle.png');
    this.load.image('confetti_1', '/assets/confetti_1.png');
    this.load.image('confetti_2', '/assets/confetti_2.png');
    this.load.image('confetti_3', '/assets/confetti_3.png');
    this.load.image('confetti_4', '/assets/confetti_4.png');

    this.load.font('Baloo', '/fonts/baloo-cyrillic.ttf');
    this.load.font('SFCompactText', '/fonts/SF-Compact-Text-Bold.ttf');
    this.load.font('SFCompactRounded', '/fonts/SF-Compact-Rounded-Bold.ttf');
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Слушаем событие изменения размера, чтобы обновить масштаб сразу
    this.scale.on('resize', () => {
      this.updateScale();
    });

    // Создаем Header
    this.header = new Header(this, 0, 0);

    // Кнопка запуска колеса
    const buttonY = this.cameras.main.height - 80;
    new SpinButton(this, centerX, buttonY, () => {
      if (this.header.hasAttempts() && !this.isSpinning) {
        this.isSpinning = true;
        this.wheel.spinWheel();
        this.header.decrementAttempts();
      } else if (!this.header.hasAttempts()) {
        new RewardAndAttentionModal(this, null, true);
      }
    });

    // Колесо фортуны
    this.wheel = new Wheel(this, centerX, centerY, this.segments);

    // Подписка на завершение вращения колеса
    this.wheel.on('spinComplete', this.finishSpin, this);

    // Применяем масштаб при старте сцены после загрузки всех элементов
    this.updateScale();
  }

  // Обработка завершения вращения
  finishSpin() {
    this.isSpinning = false;

    // Определяем сегмент, на котором остановилось колесо
    const rewardSegment = this.segments[this.wheel.getCurrentSegmentIndex()];

    // Если есть награда
    if (rewardSegment.amount !== 'Пусто') {
      const reward = {
        name: rewardSegment.name,
        amount: rewardSegment.amount,
        image: rewardSegment.image,
      };
      new RewardAndAttentionModal(this, reward);
    } else {
      // Если нет награды
      new RewardAndAttentionModal(this, null);
    }
  }
}

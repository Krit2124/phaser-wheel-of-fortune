import Phaser from 'phaser';
import Wheel from './elements/Wheel';
import SpinButton from './elements/SpinButton';
import Header from './elements/Header';
import RewardAndAttentionModal from './elements/RewardAndAttentionModal';
import type { Reward } from '../../types';
import { Rewards } from '../../data';
import { findScale } from '../../utils';

export default class GameScene extends Phaser.Scene {
  private segments: Reward[] = Rewards;

  private wheel!: Wheel;
  private header!: Header;
  private spinButton!: SpinButton;
  private modal!: RewardAndAttentionModal;

  private isSpinning: boolean = false;

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

    // Создаем Header
    this.header = new Header(this, 0, 0);

    // Создаём кнопку запуска колеса
    const buttonY = this.cameras.main.height - 80;
    this.spinButton = new SpinButton(this, centerX, buttonY, () => {
      if (this.header.hasAttempts() && !this.isSpinning) {
        this.isSpinning = true;
        this.hideHeaderAndButton();
        this.wheel.spinWheel();
        this.header.decrementAttempts();
      } else if (!this.header.hasAttempts()) {
        this.modal = new RewardAndAttentionModal(this, null, true);
      }
    });

    // Создаём колесо фортуны
    this.wheel = new Wheel(this, centerX, centerY, this.segments);

    // Подписка на завершение вращения колеса
    this.wheel.on('spinComplete', this.finishSpin, this);

    // Слушаем событие изменения размера, чтобы обновить масштабирование
    window.addEventListener('resize', () => {
      this.startScale();
    });

    // Применяем масштабирование при старте сцены после загрузки всех элементов
    this.startScale();
  }

  // Функция для адаптивного масштабирования
  private startScale() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Принудительно изменяем размер canvas
    this.scale.resize(width, height);

    // Обновляем камеру и масштабирование
    this.cameras.main.setSize(width, height);

    const { targetScale } = findScale();

    this.children.each((child: any) => {
      if (child.setScale) {
        if (child === this.header) {
          // Для шапки применяем свои правила
          this.header.updateAfterResizing(targetScale, 116 * targetScale);
        } else if (child === this.modal) {
          // Для модального окна применяем свои правила
          this.modal.updateAfterResizing(targetScale);
        } else {
          // Масштабируем остальные элементы целиком
          child.setScale(targetScale);
        }

        // Дополнительные правила для колеса фортуны
        if (child === this.wheel) {
          this.wheel.updateAfterResizing();
        }
      }
    });

    // Обновляем позиции элементов
    this.updatePositions();
  }

  // Функция для пересчёта позиций для всех элементов, которым это важно
  private updatePositions() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Кнопка
    if (this.spinButton) {
      this.spinButton.setPosition(centerX, this.cameras.main.height - 80);
    }

    // Колесо
    if (this.wheel) {
      this.wheel.setPosition(centerX, centerY);
    }
  }

  // Анимация скрытия элементов
  private hideHeaderAndButton() {
    // Шапка вверх
    this.tweens.add({
      targets: this.header,
      y: -this.header.height,
      duration: 300,
      ease: 'Power2',
    });

    // Кнопка вниз
    this.tweens.add({
      targets: this.spinButton,
      y: this.cameras.main.height + this.spinButton.height,
      duration: 300,
      ease: 'Power2',
    });
  }

  // Анимация возврата элементов
  private showHeaderAndButton() {
    // Возвращаем шапку
    this.tweens.add({
      targets: this.header,
      y: 0,
      duration: 300,
      ease: 'Power2',
    });

    // Возвращаем кнопку
    this.tweens.add({
      targets: this.spinButton,
      y: this.cameras.main.height - 80,
      duration: 300,
      ease: 'Power2',
    });
  }

  // Обработка завершения вращения
  private finishSpin() {
    this.isSpinning = false;

    // Определяем сегмент, на котором остановилось колесо
    const rewardSegment = this.segments[this.wheel.getCurrentSegmentIndex()];
    const reward = rewardSegment.amount !== 'Пусто' ? rewardSegment : null;

    // Открываем модальное окно и после закрытия возвращаем Шапку и кнопку
    this.modal = new RewardAndAttentionModal(this, reward, false, () => {
      this.showHeaderAndButton();
    });
  }
}

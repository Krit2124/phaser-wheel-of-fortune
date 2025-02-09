import Phaser from "phaser";
import Wheel from "./elements/Wheel";
import SpinButton from "./elements/SpinButton";

export default class GameScene extends Phaser.Scene {
  private wheel!: Wheel;
  private segments = [
    { name: "Монеты", reward: "x25", image: "coin.png" },
    { name: "Пусто", reward: "Пусто", image: "" },
    { name: "Подарок 2", reward: "x1", image: "gift_2.png" },
    { name: "Подарок 3", reward: "x1", image: "gift_3.png" },
    { name: "Подарок 4", reward: "x1", image: "gift_4.png" },
    { name: "Пусто", reward: "Пусто", image: "" },
    { name: "Подарок 1", reward: "x1", image: "gift_1.png" },
    { name: "Звезда", reward: "x10", image: "star.png" },
  ];

  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("pointer", "/assets/pointer.png");
    this.load.font('Baloo', '/fonts/baloo-cyrillic.ttf');
    this.load.font('SFCompactText', '/fonts/SF-Compact-Text-Bold.ttf');
    this.load.font("SFCompactRounded", '/fonts/SF-Compact-Rounded-Bold.ttf');

    this.segments.forEach((segment) => {
      if (segment.image) {
        this.load.image(segment.name, `/assets/${segment.image}`);
      }
    });
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Колесо фортуны
    this.wheel = new Wheel(this, centerX, centerY, this.segments);

    // Указатель
    this.add.image(centerX, centerY, "pointer");

    // Кнопка запуска колеса
    const buttonY = this.cameras.main.height - 80;
    new SpinButton(this, centerX, buttonY, () => {
      this.wheel.spinWheel();
    });
  }
}

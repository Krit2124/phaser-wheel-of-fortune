import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  private wheel!: Phaser.GameObjects.Container;
  private segments = [
    { name: "Монеты", reward: "x25", image: "coin.png" },
    { name: "Пусто", reward: "—", image: "" },
    { name: "Подарок 2", reward: "x1", image: "gift_2.png" },
    { name: "Подарок 3", reward: "x1", image: "gift_3.png" },
    { name: "Подарок 4", reward: "x1", image: "gift_4.png" },
    { name: "Пусто", reward: "—", image: "" },
    { name: "Подарок 1", reward: "x1", image: "gift_1.png" },
    { name: "Звезда", reward: "x10", image: "star.png" },
  ];

  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("pointer", "/assets/pointer.png");

    // Загружаем изображения призов
    this.segments.forEach((segment) => {
      if (segment.image) {
        this.load.image(segment.name, `/assets/${segment.image}`);
      }
    });
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Границы колеса
    this.add.circle(centerX, centerY, 300, 0x0d42c1);
    this.add.circle(centerX, centerY, 253, 0x003d6d);
    this.add.circle(centerX, centerY, 242, 0xc3d3fb).setStrokeStyle(1, 0x0d42c1);
    this.add.circle(centerX, centerY, 228, 0x0d42c1);

    // Контейнер для колеса
    this.wheel = this.add.container(centerX, centerY);
    const sectors = this.add.graphics();
    const sliceAngle = (2 * Math.PI) / this.segments.length;

    // Добавляем сектора
    for (let i = 0; i < this.segments.length; i++) {
      const angle = i * sliceAngle;
      const isWhiteBackground = i % 2 === 0;

      // Заливаем сектора
      sectors.fillStyle(isWhiteBackground ? 0xc3d3fb : 0x0d42c1, 1);
      sectors.slice(0, 0, 227, angle, angle + sliceAngle, false);
      sectors.fillPath();
    }

    this.wheel.add(sectors)

    // Добавляем текст и изображения после секторов
    for (let i = 0; i < this.segments.length; i++) {
      const angle = i * sliceAngle;
      const isWhiteBackground = i % 2 === 0;

      // Координаты для текста
      const textX = Math.cos(angle + sliceAngle / 2) * 100;
      const textY = Math.sin(angle + sliceAngle / 2) * 100;

      // Добавляем текст
      const text = this.add.text(textX, textY, this.segments[i].reward, {
        fontSize: this.segments[i].name === "Пусто" ? "32px" : "28px",
        color: isWhiteBackground ? "#0D42C1" : "#FFFFFF",
        fontFamily: "Arial",
        fontStyle: "bold",
      });
      text.setOrigin(0.5);
      text.setRotation(angle + Math.PI / 2); // Поворот текста в правильное положение
      this.wheel.add(text);

      // Добавляем изображение приза, если есть
      if (this.segments[i].image) {
        const prizeImage = this.add.image(
          Math.cos(angle + sliceAngle / 2) * 140,
          Math.sin(angle + sliceAngle / 2) * 140,
          this.segments[i].name
        );
        prizeImage.setOrigin(0.5);
        prizeImage.setScale(0.6);
        prizeImage.setRotation(angle + Math.PI / 2); // Поворачиваем картинку
        this.wheel.add(prizeImage);
      }
    }

    // Добавляем указатель
    this.add.image(centerX, centerY, "pointer");
  }
}

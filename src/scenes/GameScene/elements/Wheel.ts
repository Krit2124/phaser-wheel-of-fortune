import Phaser from "phaser";

export default class Wheel extends Phaser.GameObjects.Container {
  private sectors: Phaser.GameObjects.Graphics;
  private sliceAngle: number;
  private isSpinning: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, private segments: { name: string; reward: string; image: string }[]) {
    super(scene, x, y);
    scene.add.existing(this);

    this.sectors = scene.add.graphics();
    this.sliceAngle = (2 * Math.PI) / this.segments.length;

    this.createBorders();
    this.createWheel();
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
      const hasImage = this.segments[i].image !== "";

      const textRadius = hasImage ? 105 : 145;
      const textX = Math.cos(angle + this.sliceAngle / 2) * textRadius;
      const textY = Math.sin(angle + this.sliceAngle / 2) * textRadius;

      const text = this.scene.add.text(textX, textY, this.segments[i].reward, {
        fontSize: this.segments[i].reward === "Пусто" ? "32px" : "28px",
        color: isWhiteBackground ? "#0D42C1" : "#FFFFFF",
        fontFamily: "Baloo",
      });
      text.setOrigin(0.5);
      text.setRotation(angle + 90);
      this.add(text);

      if (hasImage) {
        const imageRadius = 170;
        const imageX = Math.cos(angle + this.sliceAngle / 2) * imageRadius;
        const imageY = Math.sin(angle + this.sliceAngle / 2) * imageRadius;

        const prizeImage = this.scene.add.image(imageX, imageY, this.segments[i].name);
        prizeImage.setOrigin(0.5);
        prizeImage.setRotation(angle + 90);
        this.add(prizeImage);
      }
    }
  }

  spinWheel() {
    if (this.isSpinning) return;
    this.isSpinning = true;

    const randomSpins = Phaser.Math.Between(3, 5);
    const targetAngle = randomSpins * 360 + Phaser.Math.Between(0, 360);

    this.scene.tweens.add({
      targets: this,
      angle: targetAngle,
      duration: 4000,
      ease: "Cubic.easeOut",
      onComplete: () => {
        this.isSpinning = false;
      },
    });
  }
}

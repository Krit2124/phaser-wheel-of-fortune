import Phaser from "phaser";

export default class SpinButton extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, onClick: () => void) {
    super(scene, x, y);
    scene.add.existing(this);

    const width = 596;
    const height = 94;
    const radius = 20;

    // Отрисовка кнопки
    const buttonGraphics = scene.add.graphics();
    buttonGraphics.fillStyle(0x0d42c1, 1);
    buttonGraphics.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
    buttonGraphics.lineStyle(2, 0xffffff);
    buttonGraphics.strokeRoundedRect(-width / 2, -height / 2, width, height, radius);

    // Создание интерактивной области
    const hitArea = new Phaser.Geom.Rectangle(0, 0, width, height);
    this.setSize(width, height);
    this.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    // Добавление текста
    const text = scene.add.text(0, 0, "Крутить колесо", {
      fontSize: "36px",
      color: "#FFFFFF",
      fontFamily: "SFCompactText",
      fontStyle: "bold",
    }).setOrigin(0.5);

    this.add([buttonGraphics, text]);

    // Обработчики событий
    this.on("pointerdown", onClick);
    this.on("pointerover", () => this.setCursor("pointer"));
    this.on("pointerout", () => this.setCursor("default"));
  }

  private setCursor(cursor: string) {
    this.scene.input.setDefaultCursor(cursor);
  }
}

import Phaser from "phaser";

export default class Header extends Phaser.GameObjects.Container {
  private attempts: number;
  private attemptsText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    const sceneWidth = scene.cameras.main.width;
    const headerHeight = 116;

    // Загружаем количество попыток из localStorage
    // FIXME: Ограничить тремя
    this.attempts = parseInt(localStorage.getItem("attempts") || "99999", 10);

    // Создаем фон шапки
    const headerBg = scene.add.rectangle(0, 0, sceneWidth, headerHeight, 0xffffff).setOrigin(0, 0);

    // Создаем фон для счетчика попыток
    const attemptsBg = scene.add.image(sceneWidth / 2 + 231, headerHeight / 2, "attempts_container").setOrigin(0.5);

    // Создаем текст с количеством попыток
    this.attemptsText = scene.add.text(sceneWidth / 2  + 267, headerHeight / 2, this.attempts.toString(), {
      fontSize: "28px",
      color: "#003D6D",
      fontFamily: "SFCompactRounded",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // Заголовок "Фортуна"
    const title = scene.add.text(sceneWidth / 2, headerHeight / 2, "Фортуна", {
      fontSize: "48px",
      color: "#000000",
      fontFamily: "SFCompactRounded",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // Добавляем все элементы в контейнер
    this.add([headerBg, title, attemptsBg, this.attemptsText]);

    // Обновляем количество попыток в localStorage, если оно изменилось
    window.addEventListener("beforeunload", () => {
      localStorage.setItem("attempts", this.attempts.toString());
    });
  }

  // Метод для уменьшения количества попыток
  decrementAttempts() {
    if (this.attempts > 0) {
      this.attempts--;
      this.updateAttempts();
      localStorage.setItem("attempts", this.attempts.toString());
    }
  }

  // Обновление отображения количества попыток
  private updateAttempts() {
    this.attemptsText.setText(this.attempts.toString());
  }

  // Проверка на наличие попыток
  hasAttempts() {
    return this.attempts > 0;
  }
}

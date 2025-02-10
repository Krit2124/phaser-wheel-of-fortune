import Phaser from 'phaser';

export default class Header extends Phaser.GameObjects.Container {
  private headerBg: Phaser.GameObjects.Rectangle;
  private attemptsBg: Phaser.GameObjects.Image;
  private title: Phaser.GameObjects.Text;
  private attemptsText: Phaser.GameObjects.Text;
  private attempts: number;
  public width = this.scene.scale.width;
  public height = 116;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    // Загружаем количество попыток из localStorage
    // FIXME: Ограничить тремя
    this.attempts = parseInt(localStorage.getItem('attempts') || '99999', 10);

    // Создаем фон шапки
    this.headerBg = scene.add
      .rectangle(0, 0, this.width, this.height, 0xffffff)
      .setOrigin(0, 0);

    // Заголовок
    this.title = scene.add
      .text(this.width / 2, this.height / 2, 'Фортуна', {
        fontSize: '48px',
        color: '#000000',
        fontFamily: 'SFCompactRounded',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Смещение количества попыток относительно заголовка
    const offsetForAttempts = this.title.x + this.title.width / 2 + 65;

    // Создаем фон для счетчика попыток
    this.attemptsBg = scene.add
      .image(offsetForAttempts, this.height / 2, 'attempts_container')
      .setOrigin(0.5);

    // Создаем текст с количеством попыток
    this.attemptsText = scene.add
      .text(offsetForAttempts + 36, this.height / 2, this.attempts.toString(), {
        fontSize: '28px',
        color: '#003D6D',
        fontFamily: 'SFCompactRounded',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Добавляем все элементы в контейнер
    this.add([this.headerBg, this.title, this.attemptsBg, this.attemptsText]);

    // Обновляем количество попыток в localStorage, если оно изменилось
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('attempts', this.attempts.toString());
    });
  }

  // Метод для уменьшения количества попыток
  public decrementAttempts() {
    if (this.attempts > 0) {
      this.attempts--;
      this.updateAttempts();
      localStorage.setItem('attempts', this.attempts.toString());
    }
  }

  // Обновление отображения количества попыток
  private updateAttempts() {
    this.attemptsText.setText(this.attempts.toString());
  }

  // Проверка на наличие попыток
  public hasAttempts() {
    return this.attempts > 0;
  }

  // Правила для установки размеров шапки и её элементов
  public updateAfterResizing(targetScale: number, newHeight: number) {
    let offsetForAttempts =
      this.title.x + this.title.width / 2 + this.attemptsBg.width / 2 + 65;

    // Проверяем, не выходит ли за границу экрана
    if (offsetForAttempts > this.width - this.attemptsBg.width / 2) {
      offsetForAttempts = this.width - this.attemptsBg.width / 2;
    }

    this.setSize(this.scene.scale.width, newHeight);
    
    this.headerBg.setSize(this.width, newHeight);
    this.title.setPosition(this.width / 2, this.height / 2).setScale(targetScale);
    this.attemptsBg.setPosition(offsetForAttempts, this.height / 2).setScale(targetScale);
    this.attemptsText
      .setPosition(offsetForAttempts + 36 * targetScale, this.height / 2)
      .setScale(targetScale);
  }
}

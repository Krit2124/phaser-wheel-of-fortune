/**
 *
 * @description
 * Функция для нахождения оптимального коэффициента масштабирования
 */
export function findScale() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const scaleX = width < 630 ? Phaser.Math.Clamp(width / 630, 0.6, 1) : 1;
  const scaleY = height < 890 ? Phaser.Math.Clamp(height / 890, 0.6, 1) : 1;

  const targetScale = Math.min(scaleX, scaleY);

  return { targetScale, scaleX, scaleY };
}

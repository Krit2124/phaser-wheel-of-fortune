import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';

const existingCanvas = document.getElementById('game-canvas') as HTMLCanvasElement | null;

if (existingCanvas) {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: 700,
    height: window.innerHeight,
    backgroundColor: '#ffffff',
    scene: [GameScene],
    canvas: existingCanvas,
  };

  new Phaser.Game(config);
}

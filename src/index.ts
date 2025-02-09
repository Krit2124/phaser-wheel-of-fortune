import Phaser from "phaser";
import GameScene from "./scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 700,
  height: 1180,
  backgroundColor: "#ffffff",
  scene: [GameScene],
};

export default new Phaser.Game(config);
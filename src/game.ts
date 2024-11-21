import Phaser from "phaser";


class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload(): void { }

  create(): void {
    this.add.rectangle(400, 300, 100, 100, 0x00ff00);
  }
  update(): void { }
}

const CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game",
  scene: [MainScene],
  backgroundColor: "#DDDDDD",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 200 },
      debug: true,
    },
  },
};

export function newGame(): void {
  new Phaser.Game(CONFIG);
}
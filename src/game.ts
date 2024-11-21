import Phaser from "phaser";
import { currentViewAtom, isMenuVisibleAtom, scoreAtom, store } from "./store";
import { limitScore } from "./components/utils";


class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload(): void { }

  create(): void {
    store.sub(isMenuVisibleAtom, () => {
      // TODO: I think I can check the current view here for "gameover" and restart the game properly 
      if (store.get(isMenuVisibleAtom)) {
        console.log("pause");
        this.scene.pause();
      } else {
        console.log("resume");
        this.scene.resume();
      }
    });
    this.add.rectangle(400, 300, 100, 100, 0x00ff00);
  }
  update(): void {
    if (this.scene.isPaused()) { return; }
    const cursors = this.input.keyboard!.createCursorKeys();
    if (cursors.space.isDown) {
      this.gameOver();
    }
  }

  gameOver(): void {
    store.set(scoreAtom, limitScore(1));
    store.set(currentViewAtom, "gameover");
    store.set(isMenuVisibleAtom, true);
    this.scene.restart();
  }
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
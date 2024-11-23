import Phaser from "phaser";
import { currentViewAtom, isMenuVisibleAtom, scoreAtom, store } from "./store";
import { limitScore } from "./components/utils";
import { Player } from "./entities/Player";
import { GAME_CONFIG } from "./components/constants";
import { PlatformManager } from "./managers/PlatformManager";
import { ScoreManager } from "./managers/ScoreManager";

const worldAttributes = GAME_CONFIG.world;
class MainScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: PlatformManager
  private scoreManager!: ScoreManager;
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

    this.player = new Player(this, worldAttributes.width / 2, 450);

    this.platforms = new PlatformManager(this, this.player.getSprite());
    this.scoreManager = new ScoreManager(this);

    this.cameras.main.startFollow(this.player.getSprite(), true, 0.1, GAME_CONFIG.camera.lerpSpeed);
    this.cameras.main.setDeadzone(0, GAME_CONFIG.camera.yAxisDeadzone);

  }

  update(): void {
    if (this.scene.isPaused()) { return; }
    const cursors = this.input.keyboard!.createCursorKeys();
    if (cursors.space.isDown) {
      this.gameOver();
    }
    this.player.handleMovement(cursors);

    this.platforms.createNewPlatform(this.player.getY());
    this.platforms.removeOffscreenPlatforms(this.cameras.main.scrollY);

    this.scoreManager.updateScore(this.player.getDistancedTraveled());

  }

  gameOver(): void {
    store.set(scoreAtom, limitScore(2));
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
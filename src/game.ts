import Phaser from "phaser";
import { Player } from "./entities/Player";
import { GAME_CONFIG } from "./components/constants";
import { PlatformManager } from "./managers/PlatformManager";
import { ScoreManager } from "./managers/ScoreManager";
import { gameStore } from "./GameStore";
import { Barrier } from "./entities/Barrier";

const worldAttributes = GAME_CONFIG.world;
class MainScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: PlatformManager
  private scoreManager!: ScoreManager;
  private subscriptions: Array<() => void> = [];
  private barriers: Barrier[] = [];
  constructor() {
    super("MainScene");
  }

  preload(): void {
    this.load.image("background", "assets/background.png");
    this.load.image("player", "assets/player.png");
    this.load.image("platform", "assets/platform.png");
  }

  create(): void {
    const unsubcribe = gameStore.sub("isPlaying", (isPlaying: boolean) => {
      if (isPlaying) {
        if (gameStore.getState("hasGameOver")) {
          console.log("[DEBUG]", "isPlaying, hasGameOver are TRUE");
          gameStore.setState("hasGameOver", false);
          this.destroy();
          this.scene.restart();

        } else {
          this.scene.resume();
        }
      } else {
        this.scene.pause();
      }
    });
    this.subscriptions.push(unsubcribe);

    this.add.image(worldAttributes.width / 2, worldAttributes.height / 2, "background")
      .setScrollFactor(0);

    this.player = new Player(this, worldAttributes.width / 2, 450);

    this.platforms = new PlatformManager(this, this.player.getSprite());

    this.scoreManager = new ScoreManager(this);

    let barrierRect = new Phaser.Geom.Rectangle(
      worldAttributes.borderPositionX,
      worldAttributes.height / 2,
      10,
      worldAttributes.width
    );
    this.barriers.push(new Barrier(this, this.player.getSprite(), barrierRect));
    barrierRect.x = worldAttributes.width - worldAttributes.borderPositionX;
    this.barriers.push(new Barrier(this, this.player.getSprite(), barrierRect));

    this.cameras.main.startFollow(this.player.getSprite(), true, 0, GAME_CONFIG.camera.lerpSpeed);
    this.cameras.main.setDeadzone(0, GAME_CONFIG.camera.yAxisDeadzone);
  }

  update(): void {
    if (this.scene.isPaused()) { return; }
    const cursors = this.input.keyboard!.createCursorKeys();

    this.player.handleMovement(cursors);

    this.platforms.createNewPlatform(this.player.getY());
    this.platforms.removeOffscreenPlatforms(this.cameras.main.scrollY);

    this.barriers.forEach((barrier) => barrier.updatePosition(this.cameras.main.scrollY));

    const [score, didUpdate] = this.scoreManager.updateScore(this.player.getDistancedTraveled());
    // Updates Score in StateManager
    if (didUpdate)
      gameStore.setState("score", score);

    if (this.player.getY() > this.platforms.getLowestPlatformY() + worldAttributes.height / 2) {
      this.gameOver();
    }
  }

  gameOver(): void {
    gameStore.setState("currentView", "gameover");
    gameStore.setState("isPlaying", false);
    gameStore.setState("hasGameOver", true)
  }
  destroy() {
    this.player.destroy();
    this.platforms.destroy();
    this.scoreManager.destroy();
    this.barriers.forEach((barrier) => barrier.destroy());
    this.barriers = [];
    this.subscriptions.forEach((unsub) => unsub());
    this.subscriptions = [];
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
      debug: false,
    },
  },
};

export function newGame(): void {
  new Phaser.Game(CONFIG);
}
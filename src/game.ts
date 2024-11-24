import Phaser from "phaser";
import { Player } from "./entities/Player";
import { GAME_CONFIG } from "./components/constants";
import { PlatformManager } from "./managers/PlatformManager";
import { ScoreManager } from "./managers/ScoreManager";
import { gameStore } from "./GameStore";

const worldAttributes = GAME_CONFIG.world;
class MainScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: PlatformManager
  private scoreManager!: ScoreManager;
  private subscriptions: Array<() => void> = [];
  constructor() {
    super("MainScene");
  }

  preload(): void { }

  create(): void {
    const unsubcribe = gameStore.sub("isPlaying", (isPlaying: boolean) => {
      if (isPlaying) {
        if (gameStore.getState("hasGameOver")) {
          gameStore.setState("hasGameOver", true); // Reset the flag
          this.time.delayedCall(100, () => this.scene.restart());
        } else {
          this.scene.resume();
        }
      } else {
        this.scene.pause();
      }
    });
    this.subscriptions.push(unsubcribe);

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

    const [score, didUpdate] = this.scoreManager.updateScore(this.player.getDistancedTraveled());
    // Updates Score in StateManager
    if (didUpdate)
      gameStore.setState("score", score);

  }

  gameOver(): void {
    // Clean up all subscriptions when we get a gameover
    this.subscriptions.forEach((unsub) => unsub());
    this.subscriptions = [];

    gameStore.setState("isPlaying", false);         //  switch to ui 
    gameStore.setState("currentView", "gameover");  // display gameover
    gameStore.setState("hasGameOver", true);        // set the flag
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
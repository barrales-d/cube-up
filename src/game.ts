import Phaser from "phaser";
import { Player } from "./entities/Player";
import { GAME_CONFIG } from "./components/constants";
import { PlatformManager } from "./managers/PlatformManager";
import { ScoreManager } from "./managers/ScoreManager";
import { gameStore } from "./GameStore";

class MusicScene extends Phaser.Scene {
  private backgroundMusic!: Phaser.Sound.BaseSound;
  private windSFX!: Phaser.Sound.BaseSound;
  private loseSFX!: Phaser.Sound.BaseSound;

  constructor() {
    super({
      key: "MusicScene",
      active: true
    });
  }

  preload() {
    this.load.audio("background-music", "assets/b423b42.wav");
    this.load.audio("wind-sfx", "assets/wind5.wav");
    this.load.audio("lose-sfx", "assets/win_and_lose_melodies_-_basic_lose.wav");
  }

  create() {
    this.backgroundMusic = this.sound.add("background-music", { volume: 0.05, loop: true, rate: 1.5 });
    this.backgroundMusic.play();

    this.windSFX = this.sound.add("wind-sfx", { volume: 0.02, loop: true });
    this.windSFX.play();

    this.loseSFX = this.sound.add("lose-sfx", { volume: 0.02 });

    this.scene.switch("MainScene");

  }

  public playLoseSFX() {
    this.loseSFX.play();
  }

  public playWindSFX() {
    this.windSFX.resume();
  }

  public pauseWindSFX() {
    this.windSFX.pause();
  }
}


const worldAttributes = GAME_CONFIG.world;
class MainScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: PlatformManager
  private scoreManager!: ScoreManager;
  private subscriptions: Array<() => void> = [];

  private musicScene!: MusicScene;

  constructor() {
    super("MainScene");
  }

  preload(): void {
    this.load.image("player", "assets/player.png");
    this.load.image("platform", "assets/platform-long.png");
    this.load.image("grapple-point", "assets/platform-square.png");
    this.load.image("grapple-icon", "assets/grapple-icon.png");
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
          this.musicScene.playWindSFX();
        }
      } else {
        this.scene.pause();
        this.musicScene.pauseWindSFX();
      }
    });
    this.subscriptions.push(unsubcribe);

    // Solid Color Background
    this.add.rectangle(0, 0, worldAttributes.width, worldAttributes.height, GAME_CONFIG.palette.dark).setOrigin(0).setScrollFactor(0);

    this.player = new Player(this, worldAttributes.width / 2, 450);

    this.platforms = new PlatformManager(this);

    this.player.setCollider(this, this.platforms.getPlatforms());

    this.scoreManager = new ScoreManager(this);

    this.cameras.main.startFollow(this.player.getSprite(), true, GAME_CONFIG.camera.lerpSpeed);
    this.cameras.main.setDeadzone(GAME_CONFIG.camera.yAxisDeadzone);

    this.musicScene = this.scene.get("MusicScene") as MusicScene;
  }

  update(): void {
    if (this.scene.isPaused()) { return; }
    const cursors = this.input.keyboard!.createCursorKeys();

    this.player.handleMovement(cursors);

    this.platforms.createNewPlatform(this.player.getY());
    this.platforms.removeOffscreenPlatforms(this.cameras.main.scrollY);

    // Only set the grapplePoint when the Player is not Swinging
    if (!this.player.isSwinging())
      this.player.grapplePoint = this.platforms.getNearestGrapplePoint(this.player.getSprite());

    const [score, didUpdate] = this.scoreManager.updateScore(this.player.getDistancedTraveled());
    // Updates Score in StateManager
    if (didUpdate)
      gameStore.setState("score", score);

    if (this.player.getY() > this.platforms.getLowestPlatformY() + worldAttributes.height / 2) {
      this.musicScene.playLoseSFX();
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
    this.subscriptions.forEach((unsub) => unsub());
    this.subscriptions = [];
  }
}

const CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game",
  scene: [MusicScene, MainScene],
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
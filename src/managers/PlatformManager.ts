import Phaser from 'phaser';
import { GAME_CONFIG } from '../components/constants';

const platformAttributes = GAME_CONFIG.platform;

export class PlatformManager {
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private lastPlatformY: number = 0;

  constructor(scene: Phaser.Scene, player: Phaser.GameObjects.GameObject) {
    this.platforms = scene.physics.add.staticGroup();
    this.lastPlatformY = 0;
    this.createInitialPlatforms();

    scene.physics.add.collider(player, this.platforms);
  }

  private createInitialPlatforms(): void {
    const startPlatform = this.platforms.create(400, 600, 'platform')
      .setScale(platformAttributes.scale.width, platformAttributes.scale.height)
      .refreshBody();
    this.lastPlatformY = startPlatform.y;

    for (let i = 0; i < platformAttributes.initialCount; i++) {
      this.createPlatform();
    }
  }

  private createPlatform(): void {
    const x = Phaser.Math.Between(200, GAME_CONFIG.world.width - 200);
    const y = this.lastPlatformY - Phaser.Math.Between(platformAttributes.minDistance, platformAttributes.maxDistance);

    this.platforms.create(x, y, 'platform')
      .setScale(platformAttributes.scale.width, platformAttributes.scale.height)
      .refreshBody();

    this.lastPlatformY = y;
  }

  public createNewPlatform(playerY: number): void {
    if (playerY < this.lastPlatformY + (GAME_CONFIG.world.height / 2))
      this.createPlatform();
  }

  public removeOffscreenPlatforms(cameraY: number): void {
    this.platforms.getChildren().forEach((platform) => {
      if (platform.body!.position.y > cameraY + GAME_CONFIG.world.height)
        platform.destroy();
    });
  }

  public getLowestPlatformY(): number {
    let lowestPlatformY = this.lastPlatformY;
    this.platforms.getChildren().forEach((platform) => {
      const platformYPos = platform.body!.position.y;
      // checking > because the Y axis is flipped
      if (platformYPos > lowestPlatformY) {
        lowestPlatformY = platformYPos;
      }

    });

    return lowestPlatformY;
  }

  public destroy(): void {
    this.platforms.clear(true, true);
    this.platforms.destroy();
  }
}
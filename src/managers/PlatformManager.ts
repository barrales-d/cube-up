import Phaser from 'phaser';
import { GAME_CONFIG } from '../components/constants';

const platformAttributes = GAME_CONFIG.platform;

export class PlatformManager {
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private lastPlatformY: number = 0;
  private grapplePoints!: Phaser.Physics.Arcade.StaticGroup;
  private highlighter!: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, playerX: number) {
    this.platforms = scene.physics.add.staticGroup();
    this.grapplePoints = scene.physics.add.staticGroup();
    this.lastPlatformY = 0;

    this.highlighter = scene.add.graphics();

    this.createInitialPlatforms(playerX);
  }

  private createInitialPlatforms(playerX: number): void {
    const startPlatform = this.platforms.create(400, 600, 'platform')
      .setScale(platformAttributes.scale.width, platformAttributes.scale.height)
      .refreshBody();
    this.lastPlatformY = startPlatform.y;

    for (let i = 0; i < platformAttributes.initialCount; i++) {
      this.createPlatform(playerX);
    }
  }

  private createPlatform(playerX: number): void {
    const x = Phaser.Math.Between(playerX - 200, playerX + GAME_CONFIG.world.width - 200);
    const y = this.lastPlatformY - Phaser.Math.Between(platformAttributes.minDistance, platformAttributes.maxDistance);

    this.platforms.create(x, y, 'platform')
      .setScale(platformAttributes.scale.width, platformAttributes.scale.height)
      .refreshBody();
    this.lastPlatformY = y;

    const platform = this.platforms.getLast(true).body!;

    const points = [
      new Phaser.Math.Vector2(platform.left, platform.bottom),
      new Phaser.Math.Vector2(platform.right, platform.bottom),
    ];

    points.forEach(point => {
      this.grapplePoints.create(point.x, point.y, 'grapple-point').setScale(0.035).refreshBody();
    });

  }

  public createNewPlatform(playerX: number, playerY: number): void {
    if (playerY < this.lastPlatformY + (GAME_CONFIG.world.height / 2))
      this.createPlatform(playerX);
  }

  public removeOffscreenPlatforms(cameraY: number): void {
    this.platforms.getChildren().forEach(platform => {
      if (platform.body!.position.y > cameraY + GAME_CONFIG.world.height)
        platform.destroy();
    });

    this.grapplePoints.getChildren().forEach(point => {
      if (point.body!.position.y > cameraY + GAME_CONFIG.world.height)
        point.destroy();
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
    this.grapplePoints.clear(true, true);
    this.grapplePoints.destroy();
    this.highlighter.clear();
    this.highlighter.destroy();
  }

  public getNearestGrapplePoint(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody): Phaser.Math.Vector2 | null {
    let nearestPoint: Phaser.Math.Vector2 | null = null;
    let minDistance = Number.MAX_VALUE;
    this.grapplePoints.getChildren().forEach(point => {
      const pointPos = point.body! as Phaser.Physics.Arcade.Body;

      // Do not consider points underneath Player
      if (pointPos.center.y > player.y)
        return;
      const distance = Phaser.Math.Distance.BetweenPoints(player, pointPos.center);

      if (distance < minDistance) {
        minDistance = distance;
        nearestPoint = pointPos.center;
        
        this.highlighter.clear();
        this.highlighter.lineStyle(2, GAME_CONFIG.palette.light);
        this.highlighter.strokeCircle(pointPos.center.x, pointPos.center.y, 15);
      }

    });

    return nearestPoint;
  }

  public getPlatforms(): Phaser.Physics.Arcade.StaticGroup {
    return this.platforms;
  }
}
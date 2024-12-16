import { GAME_CONFIG } from "../components/constants";

const playerAttributes = GAME_CONFIG.player;

export class Player {
  private sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private startPosition: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;

  private isGrappling: boolean = false;
  private canGrapple: boolean = true;
  private grappleRope?: Phaser.GameObjects.Line;
  private grappleIcon!: Phaser.GameObjects.Image;

  public grapplePoint: Phaser.Math.Vector2 | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, 'player').setScale(playerAttributes.scale).refreshBody();
    this.startPosition = new Phaser.Math.Vector2(x, y);

    this.sprite.setBounce(playerAttributes.bounce);

    const padding = 64;
    this.grappleIcon = scene.add.image(GAME_CONFIG.world.width - padding, GAME_CONFIG.world.height - padding, 'grapple-icon');
    this.grappleIcon.setScale(0.05).setOrigin(0).setScrollFactor(0);
  }

  public handleMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    if (this.canGrapple) {
      this.grappleIcon.setTint(0xffffff);
    } else {
      this.grappleIcon.setTint(0x888888);
    }

    // Horizontal Movement
    if (cursors.left.isDown) {
      this.sprite.setVelocityX(-playerAttributes.ground_speed);
    } else if (cursors.right.isDown) {
      this.sprite.setVelocityX(playerAttributes.ground_speed);
    } else {
      this.sprite.setVelocityX(0);
    }

    // Vertical Movement
    if (cursors.up.isDown && this.sprite.body.touching.down) {
      this.sprite.setVelocityY(-playerAttributes.jump_height);
    }


    if (cursors.space.isDown && !this.isGrappling && this.canGrapple)
      this.startGrapple();

    if (cursors.space.isUp && this.isGrappling)
      this.releaseGrapple();

    if (this.isGrappling && this.grapplePoint)
      this.updateGrapple();
  }

  public getSprite(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    return this.sprite;
  }

  public getY(): number { return this.sprite.y; }

  public getStartPosition(): Phaser.Math.Vector2 { return this.startPosition; }

  public setCollider(scene: Phaser.Scene, object: any): void {
    scene.physics.add.collider(this.sprite, object, () => {
      this.canGrapple = true;
      this.releaseGrapple();
    });
  }

  public getDistancedTraveled(): number {
    if (this.startPosition.y - this.sprite.y < 0) return 0;
    return Math.abs(this.startPosition.y - this.sprite.y) / playerAttributes.jump_height;
  }

  public destroy(): void {
    this.releaseGrapple();
    this.sprite.destroy();
  }

  public isSwinging(): boolean { return this.isGrappling; }

  private startGrapple(): void {
    if (!this.grapplePoint)
      return;

    this.isGrappling = true;
    this.canGrapple = false;

    this.grappleRope = this.sprite.scene.add.line(
      0, 0,
      this.sprite.x, this.sprite.y,
      this.grapplePoint.x, this.grapplePoint.y,
      GAME_CONFIG.palette.light
    ).setOrigin(0, 0);

    this.grappleRope.setLineWidth(playerAttributes.grappleWidth);
  }

  private updateGrapple(): void {
    if (!this.grapplePoint || !this.grappleRope)
      return;

    const distance = Phaser.Math.Distance.BetweenPoints(this.sprite, this.grapplePoint);
    console.log(distance);
    if (distance < playerAttributes.maxDistanceToRelease) {
      this.releaseGrapple();
      return;
    }


    this.grappleRope.setTo(
      this.sprite.x, this.sprite.y,
      this.grapplePoint.x, this.grapplePoint.y
    );

    const angle = Phaser.Math.Angle.BetweenPoints(this.sprite, this.grapplePoint);
    const perpAngle = angle + Math.PI / 2;

    const swingForce = new Phaser.Math.Vector2;
    swingForce.setToPolar(perpAngle, playerAttributes.swingSpeed);

    const pullForce = new Phaser.Math.Vector2();
    pullForce.setToPolar(angle, playerAttributes.pullSpeed);

    const force = new Phaser.Math.Vector2(
      (pullForce.x + swingForce.x) * 0.5,
      (pullForce.y + swingForce.y) * 0.5
    );

    this.sprite.setVelocity(force.x, force.y);
  }

  private releaseGrapple(): void {
    this.isGrappling = false;
    this.grapplePoint = null;
    if (this.grappleRope) {
      this.grappleRope.destroy();
      this.grappleRope = undefined;
    }
  }
}
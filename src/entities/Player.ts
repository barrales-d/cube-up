import { GAME_CONFIG } from "../components/constants";

const playerAttributes = GAME_CONFIG.player;

export class Player {
  private sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private startPosition: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, 'player').setScale(playerAttributes.scale).refreshBody();
    this.startPosition = new Phaser.Math.Vector2(x, y);

    this.sprite.setBounce(0.2);
  }

  public handleMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    // Ground Movement
    if (cursors.left.isDown) {
      this.sprite.setVelocityX(-playerAttributes.ground_speed);
    } else if (cursors.right.isDown) {
      this.sprite.setVelocityX(playerAttributes.ground_speed);
    } else {
      this.sprite.setVelocityX(0);
    }

    // Jump Movement
    if (cursors.up.isDown && this.sprite.body.touching.down) {
      this.sprite.setVelocityY(-playerAttributes.jump_height);
    }
  }

  public getSprite(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    return this.sprite;
  }

  public getY(): number { return this.sprite.y; }

  public getStartPosition(): Phaser.Math.Vector2 { return this.startPosition; }

  public setCollider(scene: Phaser.Scene, object: any): void {
    scene.physics.add.collider(this.sprite, object);
  }

  public getDistancedTraveled(): number {
    if (this.startPosition.y - this.sprite.y < 0) return 0;
    return Math.abs(this.startPosition.y - this.sprite.y) / playerAttributes.jump_height;
  }
}
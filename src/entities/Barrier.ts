export class Barrier {
  private rect: Phaser.GameObjects.Rectangle;
  constructor(
    scene: Phaser.Scene,
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    rect: Phaser.Geom.Rectangle
  ) {
    this.rect = scene.add.rectangle(rect.x, rect.y, rect.width, rect.height, 0x000000, 0);

    scene.physics.add.existing(this.rect, true);

    scene.physics.add.collider(player, this.rect);
  }

  updatePosition(cameraY: number) {
    this.rect.setY(cameraY + 400);

    (this.rect.body as Phaser.Physics.Arcade.Body).updateFromGameObject();
  }
}
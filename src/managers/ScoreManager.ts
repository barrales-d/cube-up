import Phaser from "phaser";
import { limitScore } from "../components/utils";

export class ScoreManager {
  private scoreText!: Phaser.GameObjects.Text;
  private score: number = 0;

  constructor(scene: Phaser.Scene) {
    this.scoreText = scene.add.text(16, 16, '0.00m', {
      fontFamily: "Elite",
      fontSize: '32px',
      color: '#6883BA'
    });
    this.scoreText.setScrollFactor(0);
  }

  public updateScore(distance: number): [number, boolean] {
    if (distance > this.score) {
      this.score = limitScore(distance);
      this.scoreText.setText(`${this.score}m`);
      return [this.score, true] as const;
    }
    return [this.score, false] as const;
  }

  public destroy() { this.scoreText.destroy(); }
}
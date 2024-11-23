export const GAME_CONFIG = {
  world: {
    width: 800,
    height: 600,
    gravity: 200,
    borderPositionX: 160,
  },
  player: {
    ground_speed: 160,
    jump_height: 400,
  },
  platform: {
    minDistance: 100,
    maxDistance: 200,
    initialCount: 5
  },
  camera: {
    lerpSpeed: 0.5,
    yAxisDeadzone: 200,
  }
}

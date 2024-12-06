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
    scale: 0.03,
    swingSpeed: 300,
    pullSpeed: 800,
    bounce: 0.2,
    grappleWidth: 2,
    maxDistanceToRelease: 50,
  },
  platform: {
    minDistance: 100,
    maxDistance: 200,
    initialCount: 5,
    scale: { width: 0.2, height: 0.15 }
  },
  camera: {
    lerpSpeed: 0.5,
    yAxisDeadzone: 200,
  },
  palette: {
    light: 0x6883BA,
    dark: 0x25232f
  }
}

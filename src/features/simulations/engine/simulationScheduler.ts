import type { SimulationSpeed } from '../types.ts'

export const SIMULATION_SPEED_OPTIONS: readonly SimulationSpeed[] = [0.5, 1, 2, 4]

const BASE_INTERVAL_MS = 900

export function intervalForSpeed(speed: SimulationSpeed): number {
  return Math.round(BASE_INTERVAL_MS / speed)
}

/**
 * Owns only wall-clock scheduling. It never touches simulation state or rules,
 * so the engine stays deterministic and usable without a browser.
 */
export class SimulationScheduler {
  private timer: ReturnType<typeof setInterval> | null = null
  private callback: (() => void) | null = null
  private speed: SimulationSpeed = 1
  private disposed = false

  start(callback: () => void): void {
    if (this.disposed) return
    this.stop()
    this.callback = callback
    this.timer = setInterval(callback, intervalForSpeed(this.speed))
  }

  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.callback = null
  }

  setSpeed(speed: SimulationSpeed): void {
    this.speed = speed
    if (this.timer !== null && this.callback) this.start(this.callback)
  }

  getSpeed(): SimulationSpeed {
    return this.speed
  }

  isRunning(): boolean {
    return this.timer !== null
  }

  dispose(): void {
    this.stop()
    this.disposed = true
  }
}

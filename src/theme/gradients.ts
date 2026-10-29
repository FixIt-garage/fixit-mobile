// Градієнти з Figma: Color styles → Gradient
// Перший колір світліший за role.*, другий — темніший відтінок.
export const gradients = {
  client: ['#3B82F6', '#1E40AF'],
  master: ['#8B5CF6', '#5B21B6'],
  center: ['#FB923C', '#C2410C'],
  org: ['#22C55E', '#15803D'],
} as const;

// Напрямок: зліва згори → справа знизу (координати 0–1)
export const gradientDirection = {
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
} as const;

export type GradientName = keyof typeof gradients;
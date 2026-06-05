export const GRADES = ['VB', 'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10+']

export const BOARDS = ['Main Wall', 'Kilter Board', 'Tension Board', 'Hangboard', 'Slab', 'Other']

export const SESSION_TYPES = {
  hard: { label: 'Board Strength', color: '#e84a2e', icon: '◈' },
  technique: { label: 'Footwork & Technique', color: '#2a9d8f', icon: '◉' },
  gym: { label: 'Gym Strength', color: '#e9c46a', icon: '◇' },
  endurance: { label: 'Endurance', color: '#457b9d', icon: '○' },
  recovery: { label: 'Active Recovery', color: '#6a994e', icon: '◌' },
  rest: { label: 'Full Rest', color: '#8ecae6', icon: '◯' },
}

export const WEEK_SCHEDULE = [
  { dayIndex: 0, day: 'Monday', type: 'hard' },
  { dayIndex: 1, day: 'Tuesday', type: 'technique' },
  { dayIndex: 2, day: 'Wednesday', type: 'gym' },
  { dayIndex: 3, day: 'Thursday', type: 'hard' },
  { dayIndex: 4, day: 'Friday', type: 'endurance' },
  { dayIndex: 5, day: 'Saturday', type: 'recovery' },
  { dayIndex: 6, day: 'Sunday', type: 'rest' },
]

export const STRENGTH_EXERCISES = [
  'Dead Hang',
  'One-Arm Hang',
  'Pull-Ups',
  'L-Sit',
  'Push-Ups',
  'Ring Rows',
  'Wrist Curls',
  'Reverse Wrist Curls',
  'Copenhagen Plank',
  'Hollow Body Hold',
  'Other',
]

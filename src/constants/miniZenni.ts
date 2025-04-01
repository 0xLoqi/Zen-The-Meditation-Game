import { MiniZenniColor, MiniZenniTrait } from '../store/miniZenniStore';

export const COLOR_SCHEMES: MiniZenniColor[] = [
  {
    id: 'earth',
    name: 'Earth',
    primary: '#8B4513',  // Earthy brown
    secondary: '#D2B48C', // Tan
    accent: '#556B2F',   // Olive green
  },
  {
    id: 'water',
    name: 'Water',
    primary: '#4682B4',  // Steel blue
    secondary: '#B0E0E6', // Powder blue
    accent: '#00CED1',   // Dark turquoise
  },
  {
    id: 'fire',
    name: 'Fire',
    primary: '#CD853F',  // Peru
    secondary: '#DEB887', // Burlywood
    accent: '#FF4500',   // Orange red
  },
  {
    id: 'air',
    name: 'Air',
    primary: '#87CEEB',  // Sky blue
    secondary: '#E0FFFF', // Light cyan
    accent: '#F0F8FF',   // Alice blue
  }
];

export const TRAITS: MiniZenniTrait[] = [
  {
    id: 'curious',
    name: 'Curious',
    description: 'Always eager to learn and explore new meditation techniques.',
    behaviorEffect: 'Asks more questions and shares interesting meditation facts.',
  },
  {
    id: 'sleepy',
    name: 'Sleepy',
    description: 'Finds deep peace in restful meditation states.',
    behaviorEffect: 'Yawns between sessions and gives calming advice.',
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Brings joy and lightness to the meditation practice.',
    behaviorEffect: 'Bounces after sessions and shares cheerful encouragement.',
  },
  {
    id: 'wise',
    name: 'Wise',
    description: 'Carries ancient wisdom and deep understanding.',
    behaviorEffect: 'Shares profound insights and philosophical quotes.',
  },
  {
    id: 'energetic',
    name: 'Energetic',
    description: 'Channels vibrant energy into focused meditation.',
    behaviorEffect: 'Shows enthusiasm and motivates with dynamic energy.',
  },
]; 
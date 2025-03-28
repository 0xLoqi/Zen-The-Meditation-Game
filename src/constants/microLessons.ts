import { MeditationType } from '../types';

interface MicroLesson {
  text: string;
  type: MeditationType;
}

// Collection of micro-lessons for different meditation types
const microLessons: MicroLesson[] = [
  {
    text: "Breath is the bridge connecting body and mind. Each mindful breath brings you closer to inner peace.",
    type: "Calm"
  },
  {
    text: "Just as waves come and go, thoughts arise and pass. Watch them without attachment.",
    type: "Calm"
  },
  {
    text: "The present moment is a gift. That's why we call it the present.",
    type: "Calm"
  },
  {
    text: "Peace comes from within. Do not seek it without.",
    type: "Calm"
  },
  {
    text: "When you focus on your breath, you create space between your thoughts.",
    type: "Focus"
  },
  {
    text: "Attention, like a muscle, grows stronger with consistent practice and intention.",
    type: "Focus"
  },
  {
    text: "Focus is not about avoiding distractions, but gently returning to what matters.",
    type: "Focus"
  },
  {
    text: "The mind is like water: when calm, it reflects clearly what is before it.",
    type: "Focus"
  },
  {
    text: "Sleep is the best meditation for physical restoration and mental clarity.",
    type: "Sleep"
  },
  {
    text: "As you prepare for rest, remember that letting go is an act of wisdom, not surrender.",
    type: "Sleep"
  },
  {
    text: "Rest is not idleness; it is preparation for the journey ahead.",
    type: "Sleep"
  },
  {
    text: "Your body knows how to sleep. Simply create the conditions and trust the process.",
    type: "Sleep"
  }
];

// Get a random micro-lesson for the given meditation type
export const getMicroLesson = (type: MeditationType): string => {
  const filteredLessons = microLessons.filter(lesson => lesson.type === type);
  
  if (filteredLessons.length === 0) {
    return "Remember that consistency in meditation brings profound transformation over time.";
  }
  
  const randomIndex = Math.floor(Math.random() * filteredLessons.length);
  return filteredLessons[randomIndex].text;
};

import { MeditationType } from '../types';

interface MicroLesson {
  text: string;
  type: MeditationType;
}

// Collection of meditation micro-lessons organized by meditation type
const MICRO_LESSONS: MicroLesson[] = [
  // Calm meditation micro-lessons
  {
    type: 'calm',
    text: "Notice your breath without trying to change it. Simply observe its natural rhythm."
  },
  {
    type: 'calm',
    text: "If your mind wanders, gently bring it back to your breath without judgment."
  },
  {
    type: 'calm',
    text: "Feel the weight of your body against the surface beneath you. Allow yourself to be fully supported."
  },
  {
    type: 'calm',
    text: "Scan your body from head to toe, releasing tension in each area as you go."
  },
  {
    type: 'calm',
    text: "Imagine your thoughts as clouds passing by in a clear blue sky. You are the sky, not the clouds."
  },
  {
    type: 'calm',
    text: "When you feel distracted, return to the sensation of your breath at the tip of your nose."
  },
  {
    type: 'calm',
    text: "With each exhale, let go of any tension or stress you're holding in your body."
  },
  
  // Focus meditation micro-lessons
  {
    type: 'focus',
    text: "Direct your attention to a single point of focus, such as your breath or a specific object."
  },
  {
    type: 'focus',
    text: "When your mind wanders, acknowledge the thought without judgment and return to your point of focus."
  },
  {
    type: 'focus',
    text: "Count your breaths from one to ten, then start again. If you lose count, simply begin again at one."
  },
  {
    type: 'focus',
    text: "Focus on the sensation of your feet touching the ground, anchoring you to the present moment."
  },
  {
    type: 'focus',
    text: "Notice the subtle movements of your body as you breathe. The rise and fall of your chest and abdomen."
  },
  {
    type: 'focus',
    text: "Practice being fully present with each breath, as if it's the most important thing in the world."
  },
  {
    type: 'focus',
    text: "When you find yourself planning or remembering, gently guide your attention back to now."
  },
  
  // Sleep meditation micro-lessons
  {
    type: 'sleep',
    text: "Allow your body to become heavy and sink into the surface beneath you."
  },
  {
    type: 'sleep',
    text: "With each exhale, imagine releasing all effort and tension from your muscles."
  },
  {
    type: 'sleep',
    text: "Visualize a peaceful place where you feel safe and relaxed. Explore it with all your senses."
  },
  {
    type: 'sleep',
    text: "Let your thoughts slow down like leaves gently falling from a tree in autumn."
  },
  {
    type: 'sleep',
    text: "Breathe in calm, breathe out tension. Each breath brings you closer to restful sleep."
  },
  {
    type: 'sleep',
    text: "Notice the natural heaviness of your eyelids and the comfortable weight of your body."
  },
  {
    type: 'sleep',
    text: "As you prepare for sleep, give yourself permission to set aside all concerns until tomorrow."
  }
];

/**
 * Get a random micro lesson for a specific meditation type
 * @param type - Type of meditation
 * @returns A micro lesson text
 */
export const getMicroLesson = (type: MeditationType): string => {
  const typeLessons = MICRO_LESSONS.filter(lesson => lesson.type.toLowerCase() === type.toLowerCase());
  const randomIndex = Math.floor(Math.random() * typeLessons.length);
  return typeLessons[randomIndex].text;
};
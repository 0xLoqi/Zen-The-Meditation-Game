import { MeditationType, MeditationDuration } from '../types';

/**
 * Format seconds into MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format a date to a human-readable string
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a meditation type to display name
 * @param type - Meditation type
 * @returns Formatted meditation type name
 */
export const formatMeditationType = (type: MeditationType): string => {
  return type; // Currently matching UI display, but could add special formatting in the future
};

/**
 * Format a meditation duration to display text
 * @param duration - Meditation duration in minutes
 * @returns Formatted duration string
 */
export const formatDuration = (duration: MeditationDuration): string => {
  return `${duration} min`;
};

/**
 * Format a number with commas for thousands
 * @param num - Number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format a percentage value
 * @param value - Percentage value
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

/**
 * Format streak to display text
 * @param streakCount - Number of days in streak
 * @returns Formatted streak string
 */
export const formatStreak = (streakCount: number): string => {
  return streakCount === 1 ? `${streakCount} day` : `${streakCount} days`;
};

/**
 * Convert milliseconds to seconds
 * @param ms - Time in milliseconds
 * @returns Time in seconds
 */
export const msToSeconds = (ms: number): number => {
  return Math.floor(ms / 1000);
};

/**
 * Format time elapsed since a date
 * @param date - Date to calculate elapsed time from
 * @returns Formatted elapsed time string
 */
export const formatTimeElapsed = (date: Date): string => {
  const now = new Date();
  const elapsed = now.getTime() - new Date(date).getTime();
  
  const minutes = Math.floor(elapsed / (1000 * 60));
  const hours = Math.floor(elapsed / (1000 * 60 * 60));
  const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
  
  if (days > 0) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  }
  
  if (hours > 0) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }
  
  if (minutes > 0) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  }
  
  return 'just now';
};
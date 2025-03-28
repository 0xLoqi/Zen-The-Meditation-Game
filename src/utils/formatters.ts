import { MeditationType, MeditationDuration } from '../types';

/**
 * Format seconds into MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  // Add leading zero to seconds if less than 10
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  
  return `${minutes}:${formattedSeconds}`;
};

/**
 * Format a date to a human-readable string
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return date.toLocaleDateString(undefined, options);
};

/**
 * Format a meditation type to display name
 * @param type - Meditation type
 * @returns Formatted meditation type name
 */
export const formatMeditationType = (type: MeditationType): string => {
  return type; // Types are already in display format
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
  return streakCount === 1 ? '1 Day' : `${streakCount} Days`;
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
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  }
  
  if (diffHours > 0) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  }
  
  if (diffMinutes > 0) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
  }
  
  return 'Just now';
};

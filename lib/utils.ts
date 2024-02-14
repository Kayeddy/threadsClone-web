import mongoose from "mongoose";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge for deduplication and conditional class application.
 * @param inputs - Class names to combine, which can be conditional or straightforward strings.
 * @returns A single string with the merged and deduplicated class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if a string is a valid base64 encoded image data URL.
 * @param imageData - The string to check.
 * @returns `true` if the string is a base64 encoded image data URL, otherwise `false`.
 */
export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

/**
 * Formats a date string into a more readable string with time and date.
 * @param dateString - The ISO string of the date to format.
 * @returns A string with the formatted date and time.
 */
export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
}

/**
 * Formats a thread count number into a string with proper wording based on count.
 * @param count - The number of threads to format.
 * @returns A string representation of the thread count with appropriate wording.
 */
export function formatThreadCount(count: number): string {
  if (count === 0) {
    return "No Threads";
  } else {
    const threadCount = count.toString().padStart(2, "0");
    const threadWord = count === 1 ? "Thread" : "Threads";
    return `${threadCount} ${threadWord}`;
  }
}

/**
 * Safely converts MongoDB ObjectId fields within an object or array to strings,
 * avoiding excessive recursion and handling circular references.
 *
 * @param data - The data to convert, can be an object or array.
 * @param depth - Current recursion depth, to prevent excessive recursion.
 * @param seen - A set to track seen objects and avoid circular references.
 * @returns The same data structure with ObjectId fields converted to strings.
 */
export function convertObjectIdToString(
  data: any,
  depth: number = 0,
  seen: WeakSet<object> = new WeakSet()
): any {
  if (depth > 10) {
    // Limit recursion depth to prevent stack overflow
    return data;
  }

  if (typeof data === "object" && data !== null) {
    if (seen.has(data)) {
      return data; // Circular reference detected, skip conversion
    }
    seen.add(data);

    // Declare newData as a flexible object with string keys and any type of values
    const newData: Record<string, any> = Array.isArray(data) ? [] : {};
    for (const key of Object.keys(data)) {
      const value = data[key];
      if (value instanceof mongoose.Types.ObjectId) {
        newData[key] = value.toString();
      } else if (typeof value === "object" && value !== null) {
        newData[key] = convertObjectIdToString(value, depth + 1, seen);
      } else {
        newData[key] = value;
      }
    }
    return newData;
  }
  return data;
}

/**
 * Checks if a given user has liked a thread.
 *
 * @param likes Array of user IDs (as strings or ObjectId instances) who have liked the thread.
 * @param userId The ID of the user to check for in the likes array.
 * @returns {boolean} True if the user has liked the thread, false otherwise.
 */
export function isUserLikedThread(
  likes: Array<string>,
  userId: string
): boolean {
  // Convert all ObjectId instances in the likes array to strings for comparison
  const likesAsString = likes.map((id) => id.toString());

  // Check if userId is present in the likes array and return the result
  return likesAsString.includes(userId);
}

'use client';

import { useEffect, useRef, useCallback } from 'react';

interface AutoSaveOptions {
  delay?: number;  // Debounce delay in ms (default: 1000)
  onSave?: () => void;  // Callback when save occurs
}

/**
 * Hook that automatically saves data to localStorage with debouncing
 * @param key - localStorage key to save to
 * @param data - Data to save (will be JSON stringified)
 * @param options - Configuration options
 */
export function useAutoSave<T>(
  key: string,
  data: T,
  options: AutoSaveOptions = {}
): void {
  const { delay = 1000, onSave } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip auto-save on first render to avoid overwriting on mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        onSave?.();
      } catch (error) {
        console.error(`Failed to auto-save to ${key}:`, error);
      }
    }, delay);

    // Cleanup on unmount or data change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [key, data, delay, onSave]);
}

/**
 * Hook to load saved data from localStorage
 * @param key - localStorage key to load from
 * @param defaultValue - Default value if nothing is saved
 * @returns The loaded data or default value
 */
export function useLoadSaved<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved) as T;
    }
  } catch (error) {
    console.error(`Failed to load from ${key}:`, error);
  }

  return defaultValue;
}

/**
 * Hook that combines auto-save with a manual save function
 * @param key - localStorage key
 * @param data - Data to save
 * @param options - Configuration options
 * @returns Manual save function for immediate saves
 */
export function useAutoSaveWithManual<T>(
  key: string,
  data: T,
  options: AutoSaveOptions = {}
): () => void {
  // Use auto-save for debounced saves
  useAutoSave(key, data, options);

  // Return manual save function for immediate saves
  const manualSave = useCallback(() => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      options.onSave?.();
    } catch (error) {
      console.error(`Failed to manually save to ${key}:`, error);
    }
  }, [key, data, options]);

  return manualSave;
}

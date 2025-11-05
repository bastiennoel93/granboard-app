"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

export type Theme = 'light' | 'dark' | 'system';

interface SettingsContextType {
  // Volume settings
  volume: number;
  soundEnabled: boolean;
  setVolume: (volume: number) => void;
  toggleSound: () => void;

  // Theme settings
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark'; // The actual theme being used (system resolved to light/dark)

  // Dialog state
  isDialogOpen: boolean;
  openDialog: (customContent?: ReactNode) => void;
  closeDialog: () => void;
  customContent?: ReactNode;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [volume, setVolumeState] = useState(0.5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customContent, setCustomContent] = useState<ReactNode | undefined>();

  // Get system theme preference
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // Apply theme to document
  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    const effectiveTheme = newTheme === 'system' ? getSystemTheme() : newTheme;

    setResolvedTheme(effectiveTheme);

    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [getSystemTheme]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedVolume = localStorage.getItem('granboard_volume');
    const savedSoundEnabled = localStorage.getItem('granboard_sound_enabled');
    const savedTheme = localStorage.getItem('granboard_theme') as Theme | null;
    const shouldReopenSettings = localStorage.getItem('granboard_reopen_settings');

    /* eslint-disable react-hooks/set-state-in-effect */
    if (savedVolume) {
      setVolumeState(parseFloat(savedVolume));
    }
    if (savedSoundEnabled) {
      setSoundEnabled(savedSoundEnabled === 'true');
    }
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Default to system theme
      applyTheme('system');
    }

    // Reopen settings dialog if it was open before language change
    if (shouldReopenSettings === 'true') {
      localStorage.removeItem('granboard_reopen_settings');
      setIsDialogOpen(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyTheme('system');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    localStorage.setItem('granboard_volume', newVolume.toString());
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('granboard_sound_enabled', newValue.toString());
      return newValue;
    });
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('granboard_theme', newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  const openDialog = useCallback((customContent?: ReactNode) => {
    setCustomContent(customContent);
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
    setCustomContent(undefined);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        volume,
        soundEnabled,
        setVolume,
        toggleSound,
        theme,
        setTheme,
        resolvedTheme,
        isDialogOpen,
        openDialog,
        closeDialog,
        customContent,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

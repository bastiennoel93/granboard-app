"use client";

import { useSettings, Theme } from "@/app/contexts/SettingsContext";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faVolumeHigh, faVolumeMute, faGlobe, faMoon, faSun, faDesktop } from "@fortawesome/free-solid-svg-icons";

export function GlobalSettingsDialog() {
  const { isDialogOpen, closeDialog, volume, soundEnabled, setVolume, toggleSound, theme, setTheme, customContent } = useSettings();
  const t = useTranslations();

  if (!isDialogOpen) return null;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div data-testid="settings-dialog" className="bg-theme-elevated rounded-2xl border-2 border-theme-primary max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex justify-between items-center p-6 pb-4 border-b border-theme-primary">
          <h3 className="font-bold text-theme-primary text-2xl">{t('settings.title')}</h3>
          <button
            data-testid="settings-close-button"
            onClick={closeDialog}
            className="text-theme-tertiary hover:text-theme-primary text-2xl font-bold px-3 py-1 bg-theme-interactive-hover rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Global Settings - Always visible */}

          {/* Sound Control */}
          <div className="bg-theme-card rounded-xl p-4 border border-theme-card">
            <div className="flex items-center justify-between">
              <label className="text-theme-primary font-bold text-base flex items-center gap-2">
                <FontAwesomeIcon icon={soundEnabled ? faVolumeHigh : faVolumeMute} /> {t('settings.sound.label')}
              </label>
              <button
                data-testid="sound-toggle-button"
                onClick={toggleSound}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  soundEnabled
                    ? "bg-green-600 text-white hover:bg-green-500"
                    : "bg-theme-interactive text-theme-interactive bg-theme-interactive-hover"
                }`}
              >
                {t(soundEnabled ? 'settings.sound.enabled' : 'settings.sound.disabled')}
              </button>
            </div>
          </div>

          {/* Volume Control */}
          <div className="bg-theme-card rounded-xl p-4 border border-theme-card">
            <div className="flex items-center justify-between mb-3">
              <label className="text-theme-primary font-bold text-base flex items-center gap-2">
                <FontAwesomeIcon icon={faVolumeHigh} /> {t('settings.volume.label')}
              </label>
              <span className="text-theme-primary font-bold text-sm">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <input
              data-testid="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              disabled={!soundEnabled}
              className="w-full h-3 bg-slate-400 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-6
                [&::-webkit-slider-thumb]:h-6
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-slate-700
                dark:[&::-webkit-slider-thumb]:border-white
                dark:[&::-webkit-slider-thumb]:bg-slate-800
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:hover:scale-110
                [&::-webkit-slider-thumb]:shadow-xl
                [&::-webkit-slider-thumb]:transition-transform
                [&::-moz-range-thumb]:w-6
                [&::-moz-range-thumb]:h-6
                [&::-moz-range-thumb]:bg-white
                [&::-moz-range-thumb]:border-2
                [&::-moz-range-thumb]:border-slate-700
                dark:[&::-moz-range-thumb]:border-white
                dark:[&::-moz-range-thumb]:bg-slate-800
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:cursor-pointer
                [&::-moz-range-thumb]:hover:scale-110
                [&::-moz-range-thumb]:shadow-xl"
            />
            {!soundEnabled && (
              <p className="text-theme-muted text-xs mt-2 text-center">
                {t('settings.volume.enableSoundFirst')}
              </p>
            )}
          </div>

          {/* Theme Selector */}
          <div className="bg-theme-card rounded-xl p-4 border border-theme-card">
            <label className="text-theme-primary font-bold text-base flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={theme === 'dark' ? faMoon : theme === 'light' ? faSun : faDesktop} />
              {t('settings.theme.label')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
                  theme === 'light'
                    ? 'bg-amber-500 text-white'
                    : 'bg-theme-interactive text-theme-interactive bg-theme-interactive-hover'
                }`}
              >
                <FontAwesomeIcon icon={faSun} className="w-4 h-4" />
                <span className="hidden sm:inline">{t('settings.theme.light')}</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
                  theme === 'dark'
                    ? 'bg-slate-600 text-white'
                    : 'bg-theme-interactive text-theme-interactive bg-theme-interactive-hover'
                }`}
              >
                <FontAwesomeIcon icon={faMoon} className="w-4 h-4" />
                <span className="hidden sm:inline">{t('settings.theme.dark')}</span>
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
                  theme === 'system'
                    ? 'bg-accent text-white'
                    : 'bg-theme-interactive text-theme-interactive bg-theme-interactive-hover'
                }`}
              >
                <FontAwesomeIcon icon={faDesktop} className="w-4 h-4" />
                <span className="hidden sm:inline">{t('settings.theme.system')}</span>
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div className="bg-theme-card rounded-xl p-4 border border-theme-card">
            <div className="flex items-center justify-between">
              <label className="text-theme-primary font-bold text-base flex items-center gap-2">
                <FontAwesomeIcon icon={faGlobe} /> {t('settings.language.label')}
              </label>
              <LanguageSelector />
            </div>
          </div>

          {/* Custom Content - Variable content passed by the context */}
          {customContent && (
            <div className="border-t border-theme-primary pt-4">
              {customContent}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex-shrink-0 p-6 pt-4 border-t border-theme-primary">
          <button
            onClick={closeDialog}
            className="w-full px-6 py-3 bg-accent text-white rounded-xl hover:opacity-90 font-bold transition-all shadow-lg"
          >
            {t('settings.close')}
          </button>
        </div>
      </div>
    </div>
  );
}

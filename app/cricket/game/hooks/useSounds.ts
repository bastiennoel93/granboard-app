import { useEffect, useRef } from "react";
import { useSettings } from "@/app/contexts/SettingsContext";

type SoundType =
  | "dart-miss"
  | "game-over"
  | "bull"
  | "double-bull"
  | "victory"
  | "whistle-single"
  | "whistle-double"
  | "whistle-triple"
  | "goat";

export function useSounds() {
  const { volume, soundEnabled } = useSettings();
  const audioContextRef = useRef<AudioContext | null>(null);
  const dartMissAudioRef = useRef<HTMLAudioElement | null>(null);
  const siffletAudioRef = useRef<HTMLAudioElement | null>(null);
  const gameOverAudioRef = useRef<HTMLAudioElement | null>(null);
  const victoryAudioRef = useRef<HTMLAudioElement | null>(null);
  const bullAudioRef = useRef<HTMLAudioElement | null>(null);
  const doubleBullAudioRef = useRef<HTMLAudioElement | null>(null);
  const goatAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize AudioContext on first user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      // Preload dart-miss sound
      if (!dartMissAudioRef.current) {
        dartMissAudioRef.current = new Audio("/assets/songs/dart-miss.mp3");
        dartMissAudioRef.current.preload = "auto";
      }

      // Preload sifflet sound
      if (!siffletAudioRef.current) {
        siffletAudioRef.current = new Audio("/assets/songs/sifflet.mp3");
        siffletAudioRef.current.preload = "auto";
      }

      // Preload game-over sound
      if (!gameOverAudioRef.current) {
        gameOverAudioRef.current = new Audio("/assets/songs/game-over.mp3");
        gameOverAudioRef.current.preload = "auto";
      }

      // Preload victory sound
      if (!victoryAudioRef.current) {
        victoryAudioRef.current = new Audio("/assets/songs/victory.mp3");
        victoryAudioRef.current.preload = "auto";
      }

      // Preload bull sound
      if (!bullAudioRef.current) {
        bullAudioRef.current = new Audio("/assets/songs/bull.mp3");
        bullAudioRef.current.preload = "auto";
      }

      // Preload double-bull sound
      if (!doubleBullAudioRef.current) {
        doubleBullAudioRef.current = new Audio("/assets/songs/double-bull.mp3");
        doubleBullAudioRef.current.preload = "auto";
      }

      // Preload goat sound
      if (!goatAudioRef.current) {
        goatAudioRef.current = new Audio("/assets/songs/goat.mp3");
        goatAudioRef.current.preload = "auto";
      }
    };

    document.addEventListener("click", initAudio, { once: true });
    return () => document.removeEventListener("click", initAudio);
  }, []);

  const playBeep = (
    frequency: number,
    duration: number,
    baseVolume: number = 0.3,
    waveType: OscillatorType = "sine"
  ) => {
    if (!soundEnabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Chaîne audio avec filtre pour un son plus doux
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = waveType;

    // Filtre passe-bas pour adoucir le son
    filter.type = "lowpass";
    filter.frequency.value = frequency * 2;
    filter.Q.value = 1;

    // Appliquer le volume global avec enveloppe ADSR
    const adjustedVolume = baseVolume * volume;
    const now = ctx.currentTime;

    // Attack (montée rapide)
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(adjustedVolume, now + 0.01);

    // Decay & Sustain
    gainNode.gain.linearRampToValueAtTime(adjustedVolume * 0.7, now + 0.05);

    // Release (descente douce)
    gainNode.gain.setValueAtTime(adjustedVolume * 0.7, now + duration - 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
  };

  const playChord = (
    frequencies: number[],
    duration: number,
    baseVolume: number = 0.2
  ) => {
    if (!soundEnabled || !audioContextRef.current) return;

    frequencies.forEach((freq) => {
      playBeep(freq, duration, baseVolume / frequencies.length);
    });
  };

  const playSifflet = () => {
    if (!soundEnabled) return;

    // Créer une nouvelle instance Audio pour chaque lecture
    const audio = new Audio("/assets/songs/sifflet.mp3");
    audio.volume = volume;
    audio.play().catch(() => {
      // Ignore errors if audio can't play
    });
  };

  const playSound = (type: SoundType) => {
    if (!soundEnabled) return;

    // Initialize audio if not already done
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    if (!dartMissAudioRef.current) {
      dartMissAudioRef.current = new Audio("/assets/songs/dart-miss.mp3");
      dartMissAudioRef.current.preload = "auto";
    }
    if (!siffletAudioRef.current) {
      siffletAudioRef.current = new Audio("/assets/songs/sifflet.mp3");
      siffletAudioRef.current.preload = "auto";
    }
    if (!gameOverAudioRef.current) {
      gameOverAudioRef.current = new Audio("/assets/songs/game-over.mp3");
      gameOverAudioRef.current.preload = "auto";
    }
    if (!victoryAudioRef.current) {
      victoryAudioRef.current = new Audio("/assets/songs/victory.mp3");
      victoryAudioRef.current.preload = "auto";
    }
    if (!bullAudioRef.current) {
      bullAudioRef.current = new Audio("/assets/songs/bull.mp3");
      bullAudioRef.current.preload = "auto";
    }
    if (!doubleBullAudioRef.current) {
      doubleBullAudioRef.current = new Audio("/assets/songs/double-bull.mp3");
      doubleBullAudioRef.current.preload = "auto";
    }
    if (!goatAudioRef.current) {
      goatAudioRef.current = new Audio("/assets/songs/goat.mp3");
      goatAudioRef.current.preload = "auto";
    }

    switch (type) {
      case "dart-miss":
        // Jouer le fichier audio MP3
        if (dartMissAudioRef.current) {
          dartMissAudioRef.current.volume = volume;
          dartMissAudioRef.current.currentTime = 0;
          dartMissAudioRef.current.play().catch(() => {
            // Ignore errors if audio can't play
          });
        }
        break;

      case "bull":
        // Jouer le fichier audio bull MP3
        if (bullAudioRef.current) {
          bullAudioRef.current.volume = volume;
          bullAudioRef.current.currentTime = 0;
          bullAudioRef.current.play().catch(() => {
            // Ignore errors if audio can't play
          });
        }
        break;

      case "double-bull":
        // Jouer le fichier audio double-bull MP3
        if (doubleBullAudioRef.current) {
          doubleBullAudioRef.current.volume = volume;
          doubleBullAudioRef.current.currentTime = 0;
          doubleBullAudioRef.current.play().catch(() => {
            // Ignore errors if audio can't play
          });
        }
        break;

      case "game-over":
        // Jouer le fichier audio game-over MP3
        if (gameOverAudioRef.current) {
          gameOverAudioRef.current.volume = volume;
          gameOverAudioRef.current.currentTime = 0;
          gameOverAudioRef.current.play().catch(() => {
            // Ignore errors if audio can't play
          });
        }
        break;

      case "victory":
        // Jouer le fichier audio victory MP3
        if (victoryAudioRef.current) {
          victoryAudioRef.current.volume = volume;
          victoryAudioRef.current.currentTime = 0;
          victoryAudioRef.current.play().catch(() => {
            // Ignore errors if audio can't play
          });
        }
        break;

      case "whistle-single":
        // 1 sifflet pour un simple qui rapporte des points
        playSifflet();
        break;

      case "whistle-double":
        // 2 sifflets pour un double qui rapporte des points
        playSifflet();
        setTimeout(() => playSifflet(), 600);
        break;

      case "whistle-triple":
        // 3 sifflets pour un triple qui rapporte des points
        playSifflet();
        setTimeout(() => playSifflet(), 600);
        setTimeout(() => playSifflet(), 1200);
        break;

      case "goat":
        // Jouer le fichier audio goat MP3
        if (goatAudioRef.current) {
          goatAudioRef.current.volume = volume;
          goatAudioRef.current.currentTime = 0;
          goatAudioRef.current.play().catch(() => {
            // Ignore errors if audio can't play
          });
        }
        break;
    }
  };

  return {
    playSound,
  };
}

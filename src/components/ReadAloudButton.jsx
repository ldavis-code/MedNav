import { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, Square } from 'lucide-react';

/**
 * ReadAloudButton - Text-to-speech accessibility component
 * Uses Web Speech API to read page content aloud.
 * Returns null if SpeechSynthesis is not supported.
 */
const ReadAloudButton = ({ contentRef }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const pollRef = useRef(null);

  // Check for browser support
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return null;
  }

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startSpeaking = useCallback(() => {
    if (!contentRef?.current) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const text = contentRef.current.innerText || contentRef.current.textContent;
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);

    // Poll to sync UI state with actual speech status
    pollRef.current = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setIsSpeaking(false);
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }, 250);
  }, [contentRef]);

  const toggleSpeech = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      startSpeaking();
    }
  }, [isSpeaking, stopSpeaking, startSpeaking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, []);

  return (
    <button
      onClick={toggleSpeech}
      className={`no-print inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors min-w-[44px] min-h-[44px] ${
        isSpeaking
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
      }`}
      aria-label={isSpeaking ? 'Stop reading aloud' : 'Read page content aloud'}
    >
      {isSpeaking ? (
        <>
          <Square size={18} aria-hidden="true" />
          Stop
        </>
      ) : (
        <>
          <Volume2 size={18} aria-hidden="true" />
          Read Aloud
        </>
      )}
    </button>
  );
};

export default ReadAloudButton;

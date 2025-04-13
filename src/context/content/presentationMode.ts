
import { useCallback } from 'react';

export const usePresentationMode = (
  setIsPresentationMode: (value: boolean) => void,
  setEditMode: (value: boolean) => void,
  setFocusedContentId: (id: string | null) => void
) => {
  const enterPresentationMode = useCallback(() => {
    setIsPresentationMode(true);
    setEditMode(false); // Exit edit mode
    setFocusedContentId(null); // Clear focus
    // Attempt fullscreen
    document.documentElement.requestFullscreen().catch(err => {
      console.warn(`Could not enter fullscreen: ${err.message}`);
    });
  }, [setIsPresentationMode, setEditMode, setFocusedContentId]);

  const exitPresentationMode = useCallback(() => {
    setIsPresentationMode(false);
    // Optionally re-enter edit mode: setEditMode(true);
    // Exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.warn(`Could not exit fullscreen: ${err.message}`);
      });
    }
  }, [setIsPresentationMode]);

  return {
    enterPresentationMode,
    exitPresentationMode
  };
};

import { useEffect } from "react";

const useKeyboardShortcuts = ({ save }: { save: () => void }) => {
  useEffect(() => {
    const handleSave = (event: KeyboardEvent) => {
      if (event.key === "s" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        save();
      }
    };

    window.addEventListener("keydown", handleSave);

    return () => {
      window.removeEventListener("keydown", handleSave);
    };
  }, [save]);
};

export default useKeyboardShortcuts;

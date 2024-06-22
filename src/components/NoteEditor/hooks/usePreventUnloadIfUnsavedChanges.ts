import { useEffect } from "react";

const usePreventUnloadIfUnsavedChanges = ({
  hasUnsavedChanges,
  save,
}: {
  hasUnsavedChanges: boolean;
  save: () => void;
}) => {
  useEffect(() => {
    const handleBeforeUnload = (event: Event) => {
      if (!hasUnsavedChanges) {
        return;
      }

      event.preventDefault();
      save();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [save, hasUnsavedChanges, save]);
};

export default usePreventUnloadIfUnsavedChanges;

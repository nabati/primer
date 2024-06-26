import { useEffect } from "react";

const useWindowKeydown = (handleKeydown: (event: KeyboardEvent) => void) => {
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);
};

export default useWindowKeydown;

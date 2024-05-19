import { debounce } from "lodash";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import prompts from "./prompts.ts";

type RootState = {
  coach: {
    prompt: string;
  };
  passiveEditorContent: string;
};

const initialState: RootState = {
  coach: {
    prompt: "",
  },
  passiveEditorContent: "",
};

export const usePrimerStore = create<RootState>(() => initialState);

export const useCoachState = () =>
  usePrimerStore(useShallow((state) => state.coach));

export const setCoachState = (coach: RootState["coach"]) => {
  setDefaultPrompt.cancel();
  return usePrimerStore.setState((state) => ({
    ...state,
    coach: {
      ...state.coach,
      ...coach,
    },
  }));
};

export const usePassiveEditorContent = () =>
  usePrimerStore((state) => state.passiveEditorContent);

export const setPrompt = (prompt: string) => setCoachState({ prompt });

const setDefaultPrompt = debounce(
  (content: string) => setCoachState({ prompt: prompts.default(content) }),
  3000,
  {
    leading: true,
    trailing: true,
  },
);

export const setPassiveEditorContent = (passiveEditorContent: string) => {
  setDefaultPrompt(passiveEditorContent);
  return usePrimerStore.setState((state) => ({
    ...state,
    passiveEditorContent,
  }));
};

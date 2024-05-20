import { create } from "zustand";

export type Activity = {
  type: "journal" | "drill";
  content: string;
};

type RootState = {
  passiveEditorContent: string;
  activity: Activity;
};

const initialState: RootState = {
  passiveEditorContent: "",
  activity: {
    type: "journal",
    content: "",
  },
};

export const usePrimerStore = create<RootState>(() => initialState);

export const usePassiveEditorContent = () =>
  usePrimerStore((state) => state.passiveEditorContent);

export const setPassiveEditorContent = (passiveEditorContent: string) => {
  return usePrimerStore.setState((state) => {
    if (state.passiveEditorContent === passiveEditorContent) {
      return state;
    }

    return {
      ...state,
      passiveEditorContent,
      activity: {
        type: "journal",
        content: passiveEditorContent,
      },
    };
  });
};

export const setDrillContent = (content: string) => {
  return usePrimerStore.setState((state) => ({
    ...state,
    activity: {
      type: "drill",
      content,
    },
  }));
};

export const useActivity = () => usePrimerStore((state) => state.activity);

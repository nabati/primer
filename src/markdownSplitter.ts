const cleanInput = (input: string): string => {
  return input.replace(/-{2,}/g, "");
};

const markdownSplitter = (input: string): string[] => {
  const splits = cleanInput(input).split("\n\n");

  if (splits.length === 1) {
    return splits;
  }

  const mergedSplits: string[] = [];

  let pendingSplit = "";
  for (const split of splits) {
    pendingSplit += split;

    if (split.trim().endsWith(":")) {
      continue;
    }

    if (split.trim().endsWith("*")) {
      continue;
    }

    if (pendingSplit.trim() === "") {
      continue;
    }

    mergedSplits.push(pendingSplit.trim());
    pendingSplit = "";
  }

  if (mergedSplits.length === 0) {
    return [""];
  }

  return mergedSplits;
};

export default markdownSplitter;

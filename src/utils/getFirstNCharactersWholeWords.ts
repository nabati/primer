const getFirstNCharactersWholeWords = (str: string, n: number) => {
  return str.split(" ").reduce((acc, word) => {
    if (acc.length + word.length <= n) {
      acc += `${word} `;
    }
    return acc;
  }, "");
};

export default getFirstNCharactersWholeWords;

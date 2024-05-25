import markdownSplitter from "./markdownSplitter.ts";

describe("hobbySplitter", () => {
  test("splits on \\n\\n when not preceded by colon", () => {
    const input = `This is a test string\n\nThis should be split\n\nAnd this one too.`;
    const expected = [
      "This is a test string",
      "This should be split",
      "And this one too.",
    ];
    expect(markdownSplitter(input)).toEqual(expected);
  });

  test("does not split on newlines when proceeded by colon", () => {
    const input = `This is a test string:  \n\n - Some points I wanted to make\n\n Some other text that I wrote`;
    const expected = [
      "This is a test string:   - Some points I wanted to make",
      "Some other text that I wrote",
    ];

    expect(markdownSplitter(input)).toEqual(expected);
  });

  test("does not split on \\n\\n when preceded by colon", () => {
    const input = `This is a test string:\n\nThis should not be split.\n\nBut this should\n\nAnd this one too.`;
    const expected = [
      "This is a test string:This should not be split.",
      "But this should",
      "And this one too.",
    ];
    expect(markdownSplitter(input)).toEqual(expected);
  });

  test("handles empty string", () => {
    const input = ``;
    const expected: string[] = [""];
    expect(markdownSplitter(input)).toEqual(expected);
  });

  test("handles string with only newlines", () => {
    const input = `\n\n\n\n`;
    const expected = [""];
    expect(markdownSplitter(input)).toEqual(expected);
  });

  test("does not split on \\n\\n when preceded by *", () => {
    const input = `This is a test string*\n\nThis should not be split.\n\nBut this should\n\nAnd this one too.`;
    const expected = [
      "This is a test string*This should not be split.",
      "But this should",
      "And this one too.",
    ];
    expect(markdownSplitter(input)).toEqual(expected);
  });

  test("trims whitespace around splits", () => {
    const input = `  This is a test string  \n\n  This should be split  \n\n  And this one too.  `;
    const expected = [
      "This is a test string",
      "This should be split",
      "And this one too.",
    ];
    expect(markdownSplitter(input)).toEqual(expected);
  });
});

import React, { useEffect } from "react";
import styled from "styled-components";
import getSemanticChunks from "../getSemanticChunks.ts";
import cosineSimilarity from "./cosineSimilarity.ts";
import Editor from "./Editor.tsx";
import getEmbedding from "./getEmbedding.ts";

const getDeterministicColorByNumber = (number: number): string => {
  const colors = ["#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6"];
  return colors[number % colors.length];
};

type ChunkerProps = {};

const Chunker: React.FC<ChunkerProps> = () => {
  const [text, setText] = React.useState("");
  const [chunks, setChunks] = React.useState<string[]>([]);
  const [similarities, setSimilarities] = React.useState<number[]>([]);

  useEffect(() => {
    (async () => {
      const nextChunks = await getSemanticChunks(text);

      const embeddings = await Promise.all(
        nextChunks.map((chunk) => getEmbedding(chunk)),
      );

      const nextSimilarities = embeddings.map((embedding, index) => {
        if (index === embeddings.length - 1) {
          return 0;
        }

        return cosineSimilarity(embedding, embeddings[index + 1]);
      });

      setChunks(nextChunks);
      setSimilarities(nextSimilarities);
    })();
  }, [text]);

  return (
    <Container>
      <div style={{ display: "flex", alignSelf: "stretch", width: "50em" }}>
        <Editor initialValue={""} onChange={(text) => setText(text)} />
      </div>

      <div>
        {chunks.map((chunk, index) => (
          <div>
            <p
              key={index}
              style={{
                borderBottom: `1px solid ${getDeterministicColorByNumber(index)}`,
              }}
            >
              {chunk}
            </p>
            <i>{similarities[index]}</i>
          </div>
        ))}
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export default Chunker;

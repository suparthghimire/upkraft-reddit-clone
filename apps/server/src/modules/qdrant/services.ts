import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { env } from '../../lib/env.schema.js';
import { QdrantClient } from '@qdrant/js-client-rest';

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 150,
  separators: ['\n\n', '\n', '. ', ' ', ''],
});

const qdrantClient = new QdrantClient({
  apiKey: env.QDRANT_API_KEY,
  url: env.QDRANT_ENDPOINT,
});

const COLLECTION_NAME = 'blogs';
const VECTOR_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

export function splitTextIntoChunks(text: string) {
  return splitter.splitText(text);
}

export async function storeEmbedding(post: { id: number; title: string; content: string }) {
  const { content, id, title } = post;

  const chunks = await splitter.splitText(content);

  return qdrantClient.upsert(COLLECTION_NAME, {
    wait: true,
    points: chunks.map((chunk, chunkIdx) => ({
      id: crypto.randomUUID(),
      vector: {
        text: `${title}\n\n${chunk}`,
        model: VECTOR_MODEL,
      },
      payload: {
        id,
        title,
        content: chunk,
        chunkIdx,
      },
    })),
  });
}

export async function getSimilarEmbeddings<T>(args: { query: string; limit?: number | undefined }) {
  const results = await qdrantClient.query(COLLECTION_NAME, {
    query: {
      text: args.query,
      model: VECTOR_MODEL,
    },
    limit: (args.limit ?? 10) * 3,
    with_payload: true,
  });

  console.log({ points: results.points });

  return results.points.map((p) => p.payload as T);
}

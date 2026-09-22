import { QdrantClient } from '@qdrant/js-client-rest';
import { env } from '../../lib/env.schema.js';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

const qdrantClient = new QdrantClient({
  url: env.QDRANT_ENDPOINT,
  apiKey: env.QDRANT_API_KEY,
});

const CLUSTER_NAME = 'blog-posts';
const EMBEDDING_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 150,
  separators: ['\n\n', '\n', '. ', ' ', ''],
});

export async function saveEmbedding(args: { postId: number; title: string; description: string }) {
  const { postId, title, description } = args;
  const chunks = await splitter.splitText(description);

  return qdrantClient.upsert(CLUSTER_NAME, {
    wait: true,
    points: chunks.map((chunk, chunkIndex) => ({
      id: crypto.randomUUID(),
      vector: {
        text: `${title}\n\n${chunk}`,
        model: EMBEDDING_MODEL,
      },
      payload: {
        postId,
        title,
        text: chunk,
        chunkIndex,
      },
    })),
  });
}

export async function getSimilarEmbeddings<TPayload>(query: string, limit = 10) {
  const result = await qdrantClient.query(CLUSTER_NAME, {
    query: {
      text: query,
      model: EMBEDDING_MODEL,
    },
    limit: limit * 3,
    with_payload: true,
  });

  return result.points.map((p) => p.payload as TPayload);
}

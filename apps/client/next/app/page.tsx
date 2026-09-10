import { getTodos } from './api';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const todos = await getTodos();
  return <main>{JSON.stringify(todos)}</main>;
}

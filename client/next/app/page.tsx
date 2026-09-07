import { getTodos } from "./api";

export default async function Home() {
  const todos = await getTodos();
  return <main>{JSON.stringify(todos)}</main>;
}

import { getTodos } from "./api";

export default async function Home() {
  const todos = await getTodos();
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-3xl text-gray-800 font-bold">
        Todos
      </h1>
        <ul>
          {todos.map(todo => (
            <li className="mb-2" key={todo.id}>{todo.id}: {todo.title}</li>
          ) )}
        </ul>
      
    </main>
  );  
}
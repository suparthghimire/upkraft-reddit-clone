import { useEffect, useState } from "react";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};
async function fetchTodos() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const todos: Promise<Todo[]> = await response.json();
  return todos;
}

function APICall() {
  const [todos, setTodos] = useState<Todo[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | undefined>(undefined);

  useEffect(() => {
    fetchTodos()
      .then((apiTodos) => {
        setTodos(apiTodos);
      })
      .catch((err) => {
        console.log("ERROR WHILE GETTING TODODS", err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      When this component is mounted for the first time, Show the list of TODOS{" "}
      {loading ? "Loading" : null}
      {todos ? JSON.stringify(todos) : null}
      {error ? "Error" : null}
    </div>
  );
}

export default APICall;

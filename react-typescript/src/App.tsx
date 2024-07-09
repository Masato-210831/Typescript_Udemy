import { useState } from "react";
import TodoList from "./components/TodoList";
import NewTodo from "./components/NewTodo";
import { Todo } from "./todo.model";

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const todoAddHandler = (text: string) => {
    setTodos((prev) => [...prev, { id: (todos.length+1).toString(), text }]);
  };

  const todoDeleteHandler = (todoId: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== todoId))
  }

  return (
    <>
      <div>
        <NewTodo onAddTodo={todoAddHandler} />
        <TodoList items={todos} onDeleteTodo={todoDeleteHandler} />
      </div>
    </>
  );
};

export default App;

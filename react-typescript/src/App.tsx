import TodoList from "./components/TodoList";
import NewTodo from "./components/NewTodo";


const App: React.FC = () => {
  const todos = [{ id: "t1", text: "TypeScriptコースの完了" }];

  return (
    <>
      <div>
        <NewTodo />
        <TodoList items={todos} />
      </div>
    </>
  );
};

export default App;

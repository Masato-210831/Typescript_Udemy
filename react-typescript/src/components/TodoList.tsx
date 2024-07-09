import { Todo } from "../todo.model";
import './TodoList.css'

interface TodoListProps {
  items: Todo[];
  onDeleteTodo: (id: string) => void;
}


const TodoList = ({ items, onDeleteTodo }: TodoListProps) => {
  return (
    <ul>
      {items.map((todo) => (
        <li key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={onDeleteTodo.bind(null, todo.id)}>削除</button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;

import React, { useRef } from "react";
import './NewTodo.css'

interface NewTodoProps {
  onAddTodo(text: string): void;
}

const NewTodo = ({ onAddTodo }: NewTodoProps) => {
  const textInputRef = useRef<HTMLInputElement>(null);
  const todoSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredText = textInputRef.current!.value;
    onAddTodo(enteredText);
    // console.log(enteredText);
  };

  return (
    <>
      <form onSubmit={todoSubmitHandler}>
        <div className="form-control">
          <label htmlFor="todo-text">Todo内容: </label>
          <input type="text" id="todo-text" ref={textInputRef} />
        </div>
        <button type="submit">TODO追加</button>
      </form>
    </>
  );
};

export default NewTodo;

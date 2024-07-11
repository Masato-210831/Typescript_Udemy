import { RequestHandler } from "express";
import { Todo } from "../models/todo";

// 本来ならDBだが今回はメモリ上で保存する
const TODOS: Todo[] = [];

// <todos> post用
export const createTodo: RequestHandler = (req, res, next) => {
  // castingでbodyにstingのtextプロパティがあることを明示する
  const text = (req.body as { text: string }).text;
  const newTodo = new Todo((TODOS.length + 1).toString(), text);

  TODOS.push(newTodo);

  res
    .status(201)
    .json({ message: "TODOを作成しました。", createdTodo: newTodo });
};

export const getTodos: RequestHandler = (req, res, next) => [
  res.json({ todos: TODOS }),
];

export const updateTodo: RequestHandler<{ id: string }> = (req, res, next) => {
  const todoId = req.params.id;
  const updateText = (req.body as { text: string }).text;

  const todoIndex = TODOS.findIndex((todo) => todo.id === todoId);
  if (todoIndex < 0) {
    throw new Error("対象のTODOが見つかりませんでした。");
  }

  TODOS[todoIndex] = new Todo(todoId, updateText);
  res.json({ message: "更新しました。", updateTodo: TODOS[todoIndex] });
};

export const deleteTodo: RequestHandler = (req, res, next) => {
  const todoId = req.params.id;

  const todoIndex = TODOS.findIndex((todo) => todo.id === todoId);
  if (todoIndex < 0) {
    throw new Error("対象のTODOが見つかりませんでした。");
  }

  TODOS.splice(todoIndex, 1);
  res.json({ message: "TODOを削除しました。" });
};

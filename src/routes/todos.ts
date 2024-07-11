import { Router } from "express";
import { createTodo, getTodos, updateTodo, deleteTodo } from "../controllers/todos";

const router = Router();

router.post("/", createTodo);

router.get("/", getTodos);

// 更新
router.patch("/:id", updateTodo);

router.delete("/:id", deleteTodo);

export default router;

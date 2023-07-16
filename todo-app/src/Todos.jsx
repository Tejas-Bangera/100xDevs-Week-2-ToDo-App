import { useEffect } from "react";
import "./todos.css";

const Todos = ({ todos, setTodos }) => {
  useEffect(getTodos, []);

  function getTodos() {
    fetch("http://localhost:4000/todos", {
      method: "GET",
    }).then((res) =>
      res.json().then((data) => {
        console.log(data);
        setTodos(data);
      })
    );
  }

  function deleteTodo(id) {
    fetch(`http://localhost:4000/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json().then((data) => setTodos(data)));
  }

  return (
    <div className="todos-list">
      <h2>Todos</h2>
      {todos.map((todo) => (
        <div key={todo.id} className="todo">
          <h4 className="todo-title">{todo.title}</h4>
          <p className="todo-description">{todo.description}</p>
          {/* <button className="todo-update-button">Update</button> */}
          <button
            className="todo-delete-button"
            onClick={() => deleteTodo(todo.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
export default Todos;

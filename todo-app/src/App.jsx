import { useState } from "react";
import "./App.css";
import Todos from "./Todos";

function App() {
  const [todos, setTodos] = useState([]);
  function addTodo(event) {
    event.preventDefault();

    const title = event.target[0].value;
    const description = event.target[1].value;

    fetch("http://localhost:4000/todos", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json().then((data) => setTodos(data)))
      .catch((error) =>
        console.log(
          "Please check if the Todo file server is up and running! " + error
        )
      );

    event.target.reset();
  }

  return (
    <>
      <div className="App">
        <h2 className="App-heading">Todo App</h2>
        <form onSubmit={addTodo}>
          <label htmlFor="title">Title</label>
          <input id="title" type="text" />
          <label htmlFor="description">Description</label>
          <input id="description" type="text" />
          <button type="submit">Submit</button>
        </form>
      </div>
      <Todos todos={todos} setTodos={setTodos} />
    </>
  );
}

export default App;

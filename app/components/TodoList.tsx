"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import ToDo from "./ToDo";
import Image from "next/image";
type Props = {};

const TodoList = (props: Props) => {
  const [todos, setTodos] = useState([] as any[]);
  const [mainInput, setMainInput] = useState("");
  const [filter, setFilter] = useState();
  const didFetchRef = useRef(false);

  useEffect(() => {
    if (didFetchRef.current === false) {
      didFetchRef.current = true;
      fetchTodos(filter);
    }
  }, [filter]);

  const fetchTodos = async (filter: any) => {
    let path = "/todos";
    if (filter !== undefined) {
      path += `?completed=${filter}`;
    }
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + path);
    const data = await res.json();
    data.sort((a: any, b: any) => a.id - b.id);
    setTodos(data);
  };
  const updateTodo = async (todo: any) => {
    const data = {
      name: todo.name,
      completed: todo.completed,
    };
    await fetch(process.env.NEXT_PUBLIC_API_URL + `/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    fetchTodos(filter);
  };

  // const debouncedUpdateTodo = useCallback(debounce(updateTodo, 500), []);

  function handleTodoChange(e: any, id: any) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    const copy = [...todos];
    const idx = copy.findIndex((todo) => todo.id === id);
    const changedTodo = { ...copy[idx], [name]: value };
    copy[idx] = changedTodo;
    updateTodo(changedTodo);
    setTodos(copy);
  }

  const addTodo = async (name: any) => {
    const data = {
      name: name,
      completed: false,
    };
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const todo = await res.json();
      setTodos([...todos, todo]);
    }
  };

  const handleDeleteTodo = async (id: any) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/todos/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      const copy = [...todos];
      const idx = copy.findIndex((todo) => todo.id === id);
      copy.splice(idx, 1);
      setTodos(copy);
    }
  };

  const handleMainInputChange = (e: any) => {
    setMainInput(e.target.value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      if (mainInput.length > 0) {
        addTodo(mainInput);
        setMainInput("");
      }
    }
  };

  const handleFilterChange = (value: any) => {
    setFilter(value);
    fetchTodos(value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-r from-emerald-50 to-lime-50">
      <div className="flex items-center gap-9 py-2 px-5 rounded-lg mt-5 mb-5">
        <Image
          src="/images/1653380665108.jpeg"
          alt="avatar"
          width={100}
          height={100}
          className="rounded-full border-4 border-lime-500"
        />
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold uppercase bg-gradient-to-r from-lime-700 to-yellow-700 text-transparent bg-clip-text">
            FastAPI / NextJS ToDo App
          </h2>
          <p className="font-medium">Features:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <span className="mr-2">🖥️</span>
              <strong>Frontend:</strong> NextJS / TailwindCSS
            </li>
            <li>
              <span className="mr-2">🚀</span>
              <strong>Backend:</strong> FastAPI / SQLAlchemy
            </li>
            <li>
              <span className="mr-2">🗄️</span>
              <strong>Database:</strong> PostgreSQL / Alembic
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col bg-white px-10 py-10 shadow-xl rounded-xl items-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-lime-500 to-yellow-500 text-transparent bg-clip-text">
          FastAPI / NextJS 13.4 ToDo App
        </h1>
        <br className="border" />
        <div className="flex items-start w-full">
          <input
            placeholder="What needs to be done?"
            value={mainInput}
            onChange={handleMainInputChange}
            onKeyDown={handleKeyDown}
            className="border border-lime-300 rounded-lg px-4 py-2 w-96 placeholder:text-lime-700 w-full"
          />
        </div>
        {!todos.length && (
          <div className="text-semibold text-lime-700">No todos yet ...</div>
        )}
        {todos.length > 0 && (
          <div className="flex flex-col">
            <div className="text-lime-500 text-2xl font-bold border-b pb-1 mb-1 border-lime-400">
              Todo List
            </div>
            <div className="flex flex-col">
              {todos.map((todo, index) => (
                <ToDo
                  todo={todo}
                  key={index}
                  onDelete={() => handleDeleteTodo(todo.id)}
                  onChange={(e: any) => handleTodoChange(e, todo.id)}
                />
              ))}
            </div>
          </div>
        )}
        <div className="flex space-x-5">
          <button
            onClick={() => handleFilterChange(undefined)}
            className={`flex items-center justify-center rounded-lg w-16 h-10 text-lime-500 hover:bg-lime-100 ${
              filter === undefined
                ? "bg-lime-100 border border-lime-500"
                : "bg-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange(true)}
            className={`flex items-center justify-center rounded-lg w-16 h-10 text-lime-500 hover:bg-lime-100 ${
              filter === true
                ? "bg-lime-100 border border-lime-500"
                : "bg-white"
            }`}
          >
            Done
          </button>
          <button
            onClick={() => handleFilterChange(false)}
            className={`flex items-center justify-center rounded-lg w-16 h-10 text-lime-500 hover:bg-lime-100 ${
              filter === false
                ? "bg-lime-100 border border-lime-500"
                : "bg-white"
            }`}
          >
            Todo
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoList;

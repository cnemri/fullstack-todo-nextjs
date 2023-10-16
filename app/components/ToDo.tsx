import { Trash2 } from "lucide-react";
import React from "react";

type Props = {
  todo: any;
  onChange: any;
  onDelete: any;
};

const ToDo = ({ todo, onChange, onDelete }: Props) => {
  return (
    <div className="flex odd:bg-lime-50 py-1 px-2 border-b border-lime-200 rounded-md gap-4">
      <div className="flex items-center justify-center gap-4">
        <input
          name="completed"
          type="checkbox"
          checked={todo.completed}
          onChange={onChange}
          className="w-5 h-5 border border-lime-500 rounded-full checked:bg-lime-500 checked:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500 cursor-pointer"
        />
        <input
          name="name"
          value={todo.name}
          onChange={onChange}
          className="px-2 py-1 bg-transparent  focus:outline-none focus:ring-2 focus:ring-lime-500 rounded-lg"
        />
      </div>
      <button
        onClick={onDelete}
        className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-4"
      >
        <span>Delete</span>
        <Trash2 size={16} className="inline-block" />
      </button>
    </div>
  );
};

export default ToDo;

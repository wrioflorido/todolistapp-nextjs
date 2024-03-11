"use client"
import React, { useState, useEffect } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'; // Import EditOutlined
import { supabase } from './utils/supabase'; // Assuming supabase is initialized in this file

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const Page = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null); // State variable to track the id of the todo being edited

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const { data, error } = await supabase.from('todolist').select('*');
        console.log(`error error:`, error);
        console.log(`data data:`, data);
        
        if (error) throw error;
        setTodos(data || []);
      } catch (error:any) {
        console.error('Error fetching todos:', error.message);
      }
    };

    fetchTodos();
  }, []);

  const handleCheckboxChange = async (id: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    try {
      await supabase.from('todolist').upsert(updatedTodos);
    } catch (error:any) {
      console.error('Error updating todo:', error.message);
    }
  };

  const handleDelete = async (id: number) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    try {
      await supabase.from('todolist').delete().match({ id });
    } catch (error:any) {
      console.error('Error deleting todo:', error.message);
    }
  };

  const handleEdit = (id: number) => {
    setEditId(id); // Set the id of the todo being edited
    const todoToEdit = todos.find(todo => todo.id === id);
    if (todoToEdit) {
      setNewTodoTitle(todoToEdit.title); // Set the newTodoTitle to the title of the todo being edited
      setShowModal(true);
    }
  };

  const handleEditTodo = async () => {
    if (editId !== null) {
      const updatedTodos = todos.map(todo =>
        todo.id === editId ? { ...todo, title: newTodoTitle } : todo
      );
      setTodos(updatedTodos);
      try {
        await supabase.from('todolist').upsert(updatedTodos);
      } catch (error:any) {
        console.error('Error updating todo:', error.message);
      }
      setEditId(null); // Reset the editId state variable
      setShowModal(false);
    }
  };

  const handleAddTodo = async () => {
    const newTodo: Todo = {
      id: todos.length + 1,
      title: newTodoTitle,
      completed: false
    };
    setTodos([...todos, newTodo]);
    setNewTodoTitle("");
    try {
      await supabase.from('todolist').insert([newTodo]);
    } catch (error:any) {
      console.error('Error adding todo:', error.message);
    }
    setShowModal(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-black w-[30%] bg-blend-difference">
        <div className='flex justify-between w-full'>
          <h1 className="text-3xl font-bold mb-4">TO DO LIST APP</h1>
          <button
            onClick={() => {
              setEditId(null); // Reset editId when adding new todo
              setShowModal(true);
            }}
            className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
          >
            Add Todo
          </button>
        </div>
        <ul>
          {todos.map((todo: Todo) => (
            <li key={todo.id} className="flex items-center py-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleCheckboxChange(todo.id)}
              />
              {editId === todo.id ? (
                <input
                  type="text"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  className="border border-gray-300 p-2 mb-2 rounded-md ml-2"
                />
              ) : (
                <p
                  className={`truncate ${todo.completed ? "line-through ml-2" : "ml-2"}`}
                  style={{ maxWidth: "calc(100% - 4rem)" }}
                  onClick={() => handleEdit(todo.id)}
                >
                  {todo.title}
                </p>
              )}
              <EditOutlined onClick={() => handleEdit(todo.id)} className="ml-2 text-black-500 cursor-pointer " />
              <DeleteOutlined onClick={() => handleDelete(todo.id)} className="ml-auto text-black-500 cursor-pointer " />
             
            </li>
          ))}
        </ul>
        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-2">{editId !== null ? 'Edit Todo' : 'Add Todo'}</h2>
              <input
                type="text"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="Enter task"
                className="border border-gray-300 p-2 mb-2 rounded-md w-full"
              />
              <div className="flex justify-end">
                <button
                  onClick={editId !== null ? handleEditTodo : handleAddTodo}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  {editId !== null ? 'Save' : 'Add'}
                </button>
                <button
                  onClick={() => {
                    setEditId(null); // Reset editId when cancelling
                    setShowModal(false);
                  }}
                  className="ml-2 bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;

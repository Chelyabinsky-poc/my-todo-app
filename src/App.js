import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList.js';
import './style.css';

const STORAGE_KEY = 'todoLists';

function App() {
  const [lists, setLists] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      { id: Date.now(), title: 'Работа', tasks: [] },
      { id: Date.now() + 1, title: 'Личное', tasks: [] }
    ];
  });

  const [newListTitle, setNewListTitle] = useState('');

  // Сохраняем в localStorage при изменении списков
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  }, [lists]);

  const addTask = (listId, text) => {
    setLists(prev =>
      prev.map(list =>
        list.id === listId
          ? { ...list, tasks: [...list.tasks, { id: Date.now(), text, completed: false }] }
          : list
      )
    );
  };

  const toggleTask = (listId, taskId) => {
    setLists(prev =>
      prev.map(list =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              )
            }
          : list
      )
    );
  };

  const deleteTask = (listId, taskId) => {
    setLists(prev =>
      prev.map(list =>
        list.id === listId
          ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) }
          : list
      )
    );
  };

  const addList = () => {
    if (newListTitle.trim()) {
      setLists(prev => [
        ...prev,
        { id: Date.now(), title: newListTitle.trim(), tasks: [] }
      ]);
      setNewListTitle('');
    }
  };

  const deleteList = (listId) => {
    if (lists.length <= 1) return; // Защита от удаления последнего списка
    setLists(prev => prev.filter(list => list.id !== listId));
  };

  return (
    <div className="app">
      <h1>Мой To-Do List</h1>
      <div className="lists-container">
        {lists.map(list => (
          <TodoList
            key={list.id}
            list={list}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onAddTask={addTask}
            onDeleteList={() => deleteList(list.id)}
          />
        ))}
      </div>

      <div className="add-list">
        <input
          type="text"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          placeholder="Название нового списка..."
        />
        <button onClick={addList}>+ Список</button>
      </div>
    </div>
  );
}

export default App;
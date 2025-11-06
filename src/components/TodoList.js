import React from 'react';
import TodoInput from './TodoInput.js';

export default function TodoList({ list, onToggleTask, onDeleteTask, onAddTask, onDeleteList }) {
  return (
    <div className="list">
      <div className="list-header">
        <h2 className="list-title">{list.title}</h2>
        <button className="delete-list" onClick={onDeleteList}>
          ✕
        </button>
      </div>
      <ul className="tasks">
        {list.tasks.map((task) => (
          <li
            key={task.id}
            className={`task ${task.completed ? 'completed' : ''}`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleTask(list.id, task.id)}
            />
            <span className="task-text">{task.text}</span>
          </li>
        ))}
      </ul>
      <TodoInput onAdd={(text) => onAddTask(list.id, text)} />
    </div>
  );
}
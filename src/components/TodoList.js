import React from 'react';
import TodoInput from './TodoInput.js';

export default function TodoList({ list, onToggleTask, onDeleteTask, onAddTask, onDeleteList }) {
  const getStatusLabel = (status) => {
    switch(status) {
      case 'planned': return '📋 Запланировано';
      case 'in-progress': return '⏳ В процессе';
      case 'completed': return '✓ Выполнена';
      default: return '📋 Запланировано';
    }
  };

  return (
    <div className="list">
      <div className="list-header">
        <h2 className="list-title">{list.title}</h2>
        <button className="delete-list" onClick={onDeleteList}>✕</button>
      </div>
      
      <ul className="tasks">
        {list.tasks.map((task) => (
          <li
            key={task.id}
            className={`task task-${task.status || 'planned'}`}
          >
            <input
              type="checkbox"
              checked={(task.status || 'planned') === 'completed'}
              onChange={() => onToggleTask(list.id, task.id)}
              id={`task-${task.id}`}
            />
            <label 
              htmlFor={`task-${task.id}`} 
              className="task-text"
              style={{ cursor: 'pointer' }}
            >
              {task.text}
            </label>
            <span className={`task-status task-status-${task.status || 'planned'}`}>
              {getStatusLabel(task.status)}
            </span>
            <button 
              className="delete-task" 
              onClick={() => onDeleteTask(list.id, task.id)}
              title="Удалить задачу"
            >
              🗑
            </button>
          </li>
        ))}
      </ul>
      <TodoInput onAdd={(text) => onAddTask(list.id, text)} />
    </div>
  );
}
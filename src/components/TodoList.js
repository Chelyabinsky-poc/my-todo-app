import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleTask, deleteTask, addTask, deleteList } from '../features/todoSlice';
import TodoInput from './TodoInput.js';

export default function TodoList({ list }) {
  const dispatch = useDispatch();

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
        <button 
          className="delete-list" 
          onClick={() => dispatch(deleteList(list.id))}
        >
          ✕
        </button>
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
              onChange={() => dispatch(toggleTask(list.id, task.id))}
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
              onClick={() => dispatch(deleteTask(list.id, task.id))}
              title="Удалить задачу"
            >
              🗑
            </button>
          </li>
        ))}
      </ul>
      <TodoInput 
        onAdd={(text) => dispatch(addTask({ listId: list.id, text }))} 
      />
    </div>
  );
}
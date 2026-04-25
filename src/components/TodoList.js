import React from 'react';
import { useDispatch } from 'react-redux';
import { 
  toggleTaskLocal, deleteTaskLocal, addTaskLocal, 
  deleteList, updateTodo, deleteTodo, createTodo
} from '../features/todoSlice';
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

  const handleToggleTask = (task) => {
    // Сначала локально переключаем
    dispatch(toggleTaskLocal({ listId: list.id, taskId: task.id }));
    
    // Если задача с бекенда (имеет id < 1000 примерно) — отправляем обновление
    if (task.id <= 200) {
      const newStatus = task.status === 'completed' ? 'planned' : 'completed';
      dispatch(updateTodo({ 
        id: task.id, 
        title: task.text, 
        completed: newStatus === 'completed',
        userId: task.userId 
      }));
    }
  };

  const handleDeleteTask = (task) => {
    dispatch(deleteTaskLocal({ listId: list.id, taskId: task.id }));
    if (task.id <= 200) {
      dispatch(deleteTodo(task.id));
    }
  };

  return (
    <div className="list">
      <div className="list-header">
        <h2 className="list-title">{list.title}</h2>
        <button className="delete-list" onClick={() => dispatch(deleteList(list.id))}>✕</button>
      </div>
      <ul className="tasks">
        {list.tasks.map((task) => (
          <li key={task.id} className={`task task-${task.status || 'planned'}`}>
            <input
              type="checkbox"
              checked={(task.status || 'planned') === 'completed'}
              onChange={() => handleToggleTask(task)}
              id={`task-${task.id}`}
            />
            <label htmlFor={`task-${task.id}`} className="task-text">
              {task.text}
            </label>
            <span className={`task-status task-status-${task.status || 'planned'}`}>
              {getStatusLabel(task.status)}
            </span>
            <button className="delete-task" onClick={() => handleDeleteTask(task)}>
              🗑
            </button>
          </li>
        ))}
      </ul>
      <TodoInput onAdd={(text) => {
        // Локально добавляем
        dispatch(addTaskLocal({ listId: list.id, text }));
        // И отправляем на бекенд
        dispatch(createTodo({
          title: text,
          completed: false,
          userId: 1
        }));
      }} />
    </div>
  );
}
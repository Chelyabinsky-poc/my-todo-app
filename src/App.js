import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addList, setNewListTitle, fetchTodos } from './features/todoSlice';
import TodoList from './components/TodoList.js';
import './style.css';

function App() {
  const dispatch = useDispatch();
  const lists = useSelector(state => state.todo.lists);
  const newListTitle = useSelector(state => state.todo.newListTitle);
  const loading = useSelector(state => state.todo.loading);
  const error = useSelector(state => state.todo.error);

  // Загружаем задачи с бекенда при первом рендере
  useEffect(() => {
    dispatch(fetchTodos(1)); // userId = 1
  }, [dispatch]);

  const handleAddList = () => {
    if (newListTitle.trim()) {
      dispatch(addList(newListTitle));
    }
  };

  if (loading) {
    return <div className="app"><h1>Загрузка...</h1></div>;
  }

  if (error) {
    return <div className="app"><h1>Ошибка: {error}</h1></div>;
  }

  return (
    <div className="app">
      <h1>Мой To-Do List 🌐</h1>
      <div className="lists-container">
        {lists.map(list => (
          <TodoList key={list.id} list={list} />
        ))}
      </div>
      <div className="add-list">
        <input
          type="text"
          value={newListTitle}
          onChange={(e) => dispatch(setNewListTitle(e.target.value))}
          placeholder="Название нового списка..."
        />
        <button onClick={handleAddList}>+ Список</button>
      </div>
    </div>
  );
}

export default App;
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addList, setNewListTitle } from './features/todoSlice';
import TodoList from './components/TodoList.js';
import './style.css';

function App() {
  const dispatch = useDispatch();
  const lists = useSelector(state => state.todo.lists);
  const newListTitle = useSelector(state => state.todo.newListTitle);

  const handleAddList = () => {
    if (newListTitle.trim()) {
      dispatch(addList(newListTitle));
    }
  };

  return (
    <div className="app">
      <h1>Мой To-Do List</h1>
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
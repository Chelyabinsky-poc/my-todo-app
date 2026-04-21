import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'todoLists';

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      { id: Date.now(), title: 'Работа', tasks: [] },
      { id: Date.now() + Math.floor(Math.random() * 1000), title: 'Личное', tasks: [] }
    ];
  } catch (error) {
    return [
      { id: Date.now(), title: 'Работа', tasks: [] },
      { id: Date.now() + Math.floor(Math.random() * 1000), title: 'Личное', tasks: [] }
    ];
  }
};

const initialState = {
  lists: loadState(),
  newListTitle: ''
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const { listId, text } = action.payload;
      const list = state.lists.find(list => list.id === listId);
      if (list) {
        list.tasks.push({
          id: Date.now(),
          text,
          status: 'planned'
        });
      }
    },
    
    toggleTask: (state, action) => {
      const { listId, taskId } = action.payload;
      const list = state.lists.find(list => list.id === listId);
      if (list) {
        const task = list.tasks.find(task => task.id === taskId);
        if (task) {
          const statusOrder = ['planned', 'in-progress', 'completed'];
          const currentIndex = statusOrder.indexOf(task.status || 'planned');
          const nextIndex = (currentIndex + 1) % statusOrder.length;
          task.status = statusOrder[nextIndex];
        }
      }
    },
    
    deleteTask: (state, action) => {
      const { listId, taskId } = action.payload;
      const list = state.lists.find(list => list.id === listId);
      if (list) {
        list.tasks = list.tasks.filter(task => task.id !== taskId);
      }
    },
    
    addList: (state, action) => {
      if (action.payload.trim()) {
        state.lists.push({
          id: Date.now(),
          title: action.payload.trim(),
          tasks: []
        });
        state.newListTitle = '';
      }
    },
    
    deleteList: (state, action) => {
      if (state.lists.length > 1) {
        state.lists = state.lists.filter(list => list.id !== action.payload);
      }
    },
    
    setNewListTitle: (state, action) => {
      state.newListTitle = action.payload;
    }
  }
});

export const { addTask, toggleTask, deleteTask, addList, deleteList, setNewListTitle } = todoSlice.actions;

export const localStorageMiddleware = store => next => action => {
  const result = next(action);
  const state = store.getState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todo.lists));
  return result;
};

export default todoSlice.reducer;
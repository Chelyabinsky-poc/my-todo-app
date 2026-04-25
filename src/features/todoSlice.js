import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { todoApi } from '../api/todoApi';

const STORAGE_KEY = 'todoLists';

// === ASYNC THUNKS ===

export const fetchTodos = createAsyncThunk(
  'todo/fetchTodos',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await todoApi.getAll(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTodo = createAsyncThunk(
  'todo/createTodo',
  async (todoData, { rejectWithValue }) => {
    try {
      const response = await todoApi.create(todoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTodo = createAsyncThunk(
  'todo/updateTodo',
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      const response = await todoApi.update(id, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todo/deleteTodo',
  async (id, { rejectWithValue }) => {
    try {
      await todoApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// === LOAD/SAVE LOCAL STORAGE ===

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const saveState = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save:', error);
  }
};

// === INITIAL STATE ===

const initialState = {
  lists: loadState() || [
    { id: 1, title: 'Работа', tasks: [], userId: 1 }
  ],
  newListTitle: '',
  loading: false,
  error: null
};

// === SLICE ===

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addList: (state, action) => {
      if (action.payload.trim()) {
        state.lists.push({
          id: Date.now(),
          title: action.payload.trim(),
          tasks: [],
          userId: 1
        });
        state.newListTitle = '';
        saveState(state.lists);
      }
    },
    deleteList: (state, action) => {
      if (state.lists.length > 1) {
        state.lists = state.lists.filter(l => l.id !== action.payload);
        saveState(state.lists);
      }
    },
    setNewListTitle: (state, action) => {
      state.newListTitle = action.payload;
    },
    // Локальные действия (без бекенда)
    addTaskLocal: (state, action) => {
      const { listId, text } = action.payload;
      const list = state.lists.find(l => l.id === listId);
      if (list) {
        list.tasks.push({
          id: Date.now(),
          text,
          status: 'planned',
          userId: 1
        });
        saveState(state.lists);
      }
    },
    toggleTaskLocal: (state, action) => {
      const { listId, taskId } = action.payload;
      const list = state.lists.find(l => l.id === listId);
      if (list) {
        const task = list.tasks.find(t => t.id === taskId);
        if (task) {
          const statusOrder = ['planned', 'in-progress', 'completed'];
          const currentIndex = statusOrder.indexOf(task.status || 'planned');
          const nextIndex = (currentIndex + 1) % statusOrder.length;
          task.status = statusOrder[nextIndex];
          saveState(state.lists);
        }
      }
    },
    deleteTaskLocal: (state, action) => {
      const { listId, taskId } = action.payload;
      const list = state.lists.find(l => l.id === listId);
      if (list) {
        list.tasks = list.tasks.filter(t => t.id !== taskId);
        saveState(state.lists);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchTodos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        // Группируем задачи по спискам (упрощённо - в первый список)
        if (state.lists[0]) {
          state.lists[0].tasks = action.payload.map(todo => ({
            id: todo.id,
            text: todo.title,
            status: todo.completed ? 'completed' : 'planned',
            userId: todo.userId
          }));
          saveState(state.lists);
        }
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createTodo
      .addCase(createTodo.fulfilled, (state, action) => {
        const newTask = {
          id: action.payload.id,
          text: action.payload.title,
          status: action.payload.completed ? 'completed' : 'planned',
          userId: action.payload.userId
        };
        if (state.lists[0]) {
          state.lists[0].tasks.push(newTask);
          saveState(state.lists);
        }
      })
      // updateTodo
      .addCase(updateTodo.fulfilled, (state, action) => {
        const updated = action.payload;
        for (const list of state.lists) {
          const task = list.tasks.find(t => t.id === updated.id);
          if (task) {
            task.text = updated.title;
            task.status = updated.completed ? 'completed' : 'planned';
            break;
          }
        }
        saveState(state.lists);
      })
      // deleteTodo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        const deletedId = action.payload;
        for (const list of state.lists) {
          list.tasks = list.tasks.filter(t => t.id !== deletedId);
        }
        saveState(state.lists);
      });
  }
});

export const { 
  addList, deleteList, setNewListTitle,
  addTaskLocal, toggleTaskLocal, deleteTaskLocal,
} = todoSlice.actions;

// Middleware для сохранения в localStorage
export const localStorageMiddleware = store => next => action => {
  const result = next(action);
  const state = store.getState();
  if (!action.type.startsWith('todo/fetch')) {
    saveState(state.todo.lists);
  }
  return result;
};

export default todoSlice.reducer;
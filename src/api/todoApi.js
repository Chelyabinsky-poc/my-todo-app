import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com';

export const todoApi = {
  // Получить все задачи (можно фильтровать по userId)
  getAll: (userId = 1) => 
    axios.get(`${API_URL}/todos?userId=${userId}`),
  
  // Создать задачу
  create: (todoData) => 
    axios.post(`${API_URL}/todos`, todoData),
  
  // Обновить задачу
  update: (id, todoData) => 
    axios.put(`${API_URL}/todos/${id}`, todoData),
  
  // Удалить задачу
  delete: (id) => 
    axios.delete(`${API_URL}/todos/${id}`)
};
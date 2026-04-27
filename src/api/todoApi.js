import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com';

export const todoApi = {
  getAll: (userId = 1) => 
    axios.get(`${API_URL}/todos?userId=${userId}`),
  
  create: (todoData) => 
    axios.post(`${API_URL}/todos`, todoData),
  
  update: (id, todoData) => 
    axios.put(`${API_URL}/todos/${id}`, todoData),
  
  delete: (id) => 
    axios.delete(`${API_URL}/todos/${id}`)
};
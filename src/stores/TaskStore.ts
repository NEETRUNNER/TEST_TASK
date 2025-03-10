import axios from 'axios';
import { defineStore } from 'pinia'

export interface Task {
  id: number | string;
  title: string;
  executor: string;
  status: string;
  deadline: string;
}

export const useTaskStore = defineStore('task', {

  state: () => ({
    taskData: [] as Task[],
  }),

  actions: {
    async getTaskData() {
      if (this.taskData.length) return; // Если данные есть, просто выходим

      try {
        const response = await axios.get('http://localhost:3000/tasksCRUD');
        console.log(response.data)
        this.taskData = response.data;
      } catch (e) {
        console.log(e)
      }
    }
  },

  persist: true // Сохранение данных
})
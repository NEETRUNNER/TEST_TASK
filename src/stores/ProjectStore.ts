import axios from 'axios';
import { defineStore } from 'pinia'

export interface Project {
  id: number | string;
  name: string;
  taskCount: number;
  status: string;
  createdAt: string;
}

export const useProjectStore = defineStore('project', {

  state: () => ({
    projectData: [] as Project[],
  }),

  actions: {
    async getProjectData() {
      if (this.projectData.length) return; // Если данные есть, просто выходим
      
      try {
        const response = await axios.get('http://localhost:3000/projects');
        console.log(response.data)
        this.projectData = response.data;
      } catch (e) {
        console.log(e)
      }
    }
  },

  persist: true // Сохранение данных
})
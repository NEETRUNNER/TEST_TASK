import { defineStore } from 'pinia'

export const useStore = defineStore('main', {

  state: () => ({
    togglerModal: false,
    togglerType: '',
    togglerFilter: false,
  }),

  actions: {
    toggleModal(boolean: boolean) {
      this.togglerModal = boolean
    },

    toggleFilter(boolean: boolean, type: string) {
      this.togglerFilter = boolean;
      this.togglerType = type;
    }
  },

  persist: true // Сохранение данных
})
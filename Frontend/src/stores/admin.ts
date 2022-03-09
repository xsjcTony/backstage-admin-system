import { defineStore } from 'pinia'


export const useAdminStore = defineStore('admin', {
  state: () => {
    return {
      menuCollapsed: false
    }
  }
})

import { defineStore } from 'pinia'
import { MainStore } from '../types'


export const useStore = defineStore('main', {
  state: (): MainStore => {
    return {
      loggedIn: false,
      currentUser: null
    }
  }
})

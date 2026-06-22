import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import { mockUser } from '@/mock/products'
import { storage } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User>(storage.get('user', mockUser))

  function updateContact(contact: string) {
    currentUser.value.contact = contact
    storage.set('user', currentUser.value)
  }

  function updateName(name: string) {
    currentUser.value.name = name
    storage.set('user', currentUser.value)
  }

  return {
    currentUser,
    updateContact,
    updateName,
  }
})

import {defineStore} from "pinia";
import type {Product} from "../models/shop.interface.ts";

export const useCartStore = defineStore('CartStore', {
  state: () => ({
    cartItems: [] as Product[],
  }),
  actions: {
    addToCart(product: Product) {
      this.cartItems.push(product)
    },

    removeFromCart(productId: number) {
      const index = this.cartItems.map(item => item.id).indexOf(productId)
      this.cartItems.splice(index, 1)
    }
  }
})
import { defineStore } from "pinia";
import type { Customer, Product, Purchase } from "../models/shop.interface.ts";

export const useShopStore = defineStore('ShopStore', {
  state: () => ({
    customers: [
      { id: 1, name: "Ahmad", city: "Tehran" },
      { id: 2, name: "Mehran", city: "Shiraz" },
      { id: 3, name: "Ali", city: "Esfahan" },
    ] as Customer [],
    products: [
      { id: 101, name: "Laptop", category: "Electronics" },
      { id: 102, name: "Mouse", category: "Electronics" },
      { id: 103, name: "Monitor", category: "Electronics" },
      { id: 104, name: "Coffee Maker", category: "Home Appliances" },
      { id: 105, name: "Blender", category: "Home Appliances" },
      { id: 106, name: "Headphones", category: "Electronics" },
    ] as Product[],
    purchases: [
      { customerId: 1, productId: 101, date: "2025-03-01" },
      { customerId: 1, productId: 102, date: "2025-02-02" },
      { customerId: 2, productId: 103, date: "2025-02-05" },
      { customerId: 2, productId: 104, date: "2025-02-06" },
      { customerId: 3, productId: 105, date: "2025-02-07" },
      { customerId: 3, productId: 106, date: "2025-02-08" },
      { customerId: 1, productId: 104, date: "2025-02-10" },
    ] as Purchase[],
  }),

  getters: {
    productMap(): {[key: number]: Product} {
      return Object.fromEntries(this.products.map(p => [p.id, p]))
    },

    productsByCustomer(): (customerId: number) => Product[] {
      return (customerId) => {
        return this.purchases.filter(p => p.customerId === customerId)
          .map(p => this.productMap[p.productId])
      }
    },

    productsOfCategoryMap(): (category: string) => {[key: number]: Product} {
      return (category) => {
        const productsOfCategory = this.products.filter(p => p.category === category)
        return Object.fromEntries(productsOfCategory.map(p => [p.id, p]))
      }
    },

    mostPurchasedCategoryByCustomerId(): (customerId: number) => string | undefined {
      return (customerId) => {
        const productsByCustomer = this.productsByCustomer(customerId)
        const categoryCount: {[key: string]: number} = {}

        for(const product of productsByCustomer) {
          const currentCount = categoryCount[product.category] || 0
          categoryCount[product.category] = currentCount + 1
        }

        if (Object.keys(categoryCount).length === 0) { return undefined }

        return Object.keys(categoryCount).reduce((a, c) => categoryCount[a] > categoryCount[c] ? a : c)
      }
    },

    recommendedProductsOfCategoryByCustomerId(): (customerId: number, category: string) => Product[] {
      return (customerId, category) => {
        const productsOfCategoryMap = this.productsOfCategoryMap(category)
        const productsByCustomer = this.productsByCustomer(customerId).map(p => p.id)

        return this.purchases.filter(p =>
          p.customerId !== customerId && (p.productId in productsOfCategoryMap) && !productsByCustomer.includes(p.productId)
        ). map(p => this.productMap[p.productId])
      }
    }
  }
})
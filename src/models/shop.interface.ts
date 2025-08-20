export interface Customer {
  id: number
  name: string
  city: string
}

export interface Product {
  id: number
  name: string
  category: string
}

export interface Purchase {
  customerId: number
  productId: number
  date: string
}
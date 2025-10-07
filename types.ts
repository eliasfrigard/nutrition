export type Nutrition = {
  calories: number
  protein?: number
  carbohydrates?: number
  sugar?: number
  fat?: number
  saturatedFat?: number
  fiber?: number
}

export type FoodItem = {
  id: string
  name: string
  category: string
  nutrition: Nutrition
}

export type AddedFood = {
  uuid: string
  id: string
  name: string
  quantity: string
  unit: string
  foodItem: FoodItem
}

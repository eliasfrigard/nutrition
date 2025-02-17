export type Nutrition = {
  calories: number
  protein?: number
  carbs?: number
  fat?: number
  saturatedFat?: number
  sugar?: number
}

export type FoodItem = {
  id: string
  name: string
  category: string
  nutrition: Nutrition
}

export type AddedFood = {
  id: string
  name: string
  quantity: string
  unit: string
  foodItem: FoodItem
}

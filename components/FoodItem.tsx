import React from 'react'

interface FoodItemProps {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

const FoodItem: React.FC<FoodItemProps> = ({ name, calories, protein, carbs, fat }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>Calories: {calories}</p>
      <p>Protein: {protein}g</p>
      <p>Carbs: {carbs}g</p>
      <p>Fat: {fat}g</p>
    </div>
  )
}

export default FoodItem

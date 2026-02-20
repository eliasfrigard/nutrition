'use client';

import React, { useEffect, useState } from 'react'
import Input from '@/components/Input'
import NutritionItem from '@/components/NutritionView/NutritionItem'
import { createClient } from '@/utils/supabase/client'
import type { Nutrition, FoodItem } from '@/types'

const supabase = createClient()

const nutritionKeys: (keyof Nutrition)[] = [
  'calories',
  'protein',
  'carbohydrates',
  'fat',
  'saturatedFat',
  'sugar',
  'fiber',
]

export default function FoodItemsDashboard() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [name, setName] = useState('')
  const [nutrition, setNutrition] = useState<Partial<Nutrition>>({
    calories: 0,
  })

  const fetchFoodItems = async () => {
    const { data, error } = await supabase.from('food_items').select('*')
    if (error) {
      console.error('Supabase error:', error)
    } else {
      setFoodItems(data as FoodItem[])
    }
  }

  const addFoodItem = async () => {
    if (!name) return alert('Please enter a name')
    if (!nutrition.calories) return alert('Calories are required')

    const { data, error } = await supabase.from('food_items').insert([
      {
        name,
        nutrition,
      },
    ])
    if (error) {
      console.error('Insert error:', error)
    } else {
      setFoodItems([...foodItems, ...(data as FoodItem[])])
      setName('')
      setNutrition({ calories: 0 })
    }
  }

  useEffect(() => {
    fetchFoodItems()
  }, [])

  return (
    <div className="p-5 w-full mx-auto text-white flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Food Items Dashboard</h1>

      {/* Add Food Item */}
      <div className="flex flex-col gap-2 p-4 border rounded bg-gray-800">
        <Input
          type="text"
          placeholder="Food Name"
          value={name}
          setValue={setName}
        />

        <div className="grid grid-cols-2 gap-2">
          {nutritionKeys.map((key) => (
            <Input
              key={key}
              type="number"
              placeholder={key}
              value={nutrition[key] ?? ''}
              setValue={(value) =>
                setNutrition({
                  ...nutrition,
                  [key]: value === '' ? undefined : parseFloat(value),
                })
              }
            />
          ))}
        </div>

        <button
          onClick={addFoodItem}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded mt-2"
        >
          Add Food Item
        </button>
      </div>

      {/* Food Items List */}
      <div className="flex flex-col gap-2">
        {foodItems.map((item) => (
          <NutritionItem
            id={item.id}
            name={item.name}
            foodItem={item}
          />
        ))}
      </div>
    </div>
  )
}

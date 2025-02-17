'use client'

import React from 'react'
import Input from '@/components/Input'
import Select from '@/components/Select'

import useStickyState from '@/hooks/useStickyState'
import type { FoodItem, AddedFood, Nutrition } from '@/types'

export default function Home() {
  const [foodItems, setFoodItems] = React.useState<FoodItem[]>([])
  const [foodName, setFoodName] = React.useState('')
  const [foodValue, setFoodValue] = React.useState('')
  const [unitValue, setUnitValue] = React.useState('')
  const [quantityValue, setQuantityValue] = React.useState('')

  const [addedItems, setAddedItems] = useStickyState([] as AddedFood[], 'addedItems')

  const totalNutrition = React.useMemo(() => {
    return addedItems.reduce((acc, item) => {
      Object.entries(item.foodItem.nutrition).forEach(([key, value]) => {
        // Type assertion to ensure key matches Nutrition keys
        const nutrientKey = key as keyof Nutrition
        acc[nutrientKey] = (acc[nutrientKey] || 0) + value
      })
      return acc
    }, {} as { [key in keyof Nutrition]: number })
  }, [addedItems])

  const copyToClipboard = (nutrient: keyof Nutrition) => {
    const value = totalNutrition[nutrient] || 0
    navigator.clipboard
      .writeText(value.toFixed(2))
      .then(() => alert(`Copied ${nutrient}: ${value.toFixed(2)}`))
      .catch((err) => console.error('Failed to copy: ', err))
  }

  const handleSubmit = () => {
    if (!foodValue || !quantityValue) {
      alert('Please select a food item and enter a quantity')
      return
    }

    const selectedFood = foodItems.find((item) => item.id === parseInt(foodValue))
    if (!selectedFood) return

    setAddedItems((prev) => [
      ...prev,
      {
        id: selectedFood.id,
        name: selectedFood.name,
        quantity: quantityValue,
        unit: unitValue,
        foodItem: selectedFood,
      },
    ])

    // Reset form fields
    setFoodName('')
    setQuantityValue('')
  }

  React.useEffect(() => {
    fetch('/foodItems.json')
      .then((res) => res.json())
      .then((data) => {
        setFoodItems(data)
      })
      .catch((error) => console.error('Error fetching food items:', error))
  }, [])

  return (
    <div className='container my-16 lg:my-24 mx-auto px-6 w-full flex items-center flex-col gap-10'>
      <div className='w-full flex flex-col gap-5 lg:w-2/3'>
        <Input
          value={foodName}
          onChange={(event) => setFoodName(event.target.value)}
        />

        <Select
          value={foodValue}
          onChange={(value) => setFoodValue(value)}
          options={
            (foodItems.length &&
              foodItems
                .map((item) => ({
                  value: item.id,
                  label: item.name,
                }))
                .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))) ||
            []
          }
        />

        <div className='flex gap-4'>
          <Input
            className='w-2/3'
            value={quantityValue}
            onChange={(event) => setQuantityValue(event.target.value)}
            placeholder='Type something...'
          />
          <Select
            value='1'
            className='w-1/3'
            placeholder='Select Unit'
            onChange={(value) => setUnitValue(value)}
            options={[{ value: 'g', label: 'Grams (g)' }]}
          />
        </div>

        <button
          onClick={handleSubmit}
          className='p-5 bg-yellow-500 text-white rounded font-bold hover:bg-yellow-600 duration-100'
        >
          Submit
        </button>
      </div>

      <div className='w-2/3 h-[1px] bg-white rounded-full opacity-10' />

      {addedItems.length > 0 && (
        <div className='w-full flex flex-col gap-4'>
          <div className='w-full text-white flex justify-end'>
            <div
              onClick={() => setAddedItems([])}
              className='p-3 rounded border border-opacity-40 border-white hover:border-opacity-100 cursor-pointer hover:bg-white hover:text-black duration-100 font-medium tracking-wide'
            >
              <p>Clear All Values</p>
            </div>
          </div>

          {addedItems.map((item) => (
            <div
              key={item.id}
              className='border w-full p-5 rounded text-white flex justify-between tracking-wide'
            >
              <h3>{item.name}</h3>
              <div className='flex gap-2'>
                {Object.entries(item.foodItem.nutrition).map(([key, value]) => (
                  <div
                    key={key}
                    className='border-r pr-2 border-yellow-500'
                  >
                    <p className='capitalize'>
                      {key}: {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className='p-5 text-lg font-semibold flex justify-between bg-yellow-500 text-white rounded'>
            <h3>Total</h3>
            <div className='flex gap-2'>
              {Object.entries(totalNutrition).map(([key, value]) => (
                <div
                  key={key}
                  className='border-r pr-2 border-yellow-500'
                >
                  <p className='capitalize'>
                    {key}: {value.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className='w-full text-white flex justify-end gap-3'>
            <button
              onClick={() => copyToClipboard('calories')}
              className='p-3 rounded border border-opacity-40 border-white hover:border-opacity-100 cursor-pointer hover:bg-white hover:text-black duration-100 font-medium tracking-wide'
            >
              <p>Calories</p>
            </button>
            <button
              onClick={() => copyToClipboard('carbs')}
              className='p-3 rounded border border-opacity-40 border-white hover:border-opacity-100 cursor-pointer hover:bg-white hover:text-black duration-100 font-medium tracking-wide'
            >
              <p>Carbohydrates</p>
            </button>
            <button
              onClick={() => copyToClipboard('protein')}
              className='p-3 rounded border border-opacity-40 border-white hover:border-opacity-100 cursor-pointer hover:bg-white hover:text-black duration-100 font-medium tracking-wide'
            >
              <p>Protein</p>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

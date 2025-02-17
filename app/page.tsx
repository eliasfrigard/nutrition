'use client'

import React from 'react'
import Input from '@/components/Input'
import Select from '@/components/Select'

type Nutrition = {
  calories: number
  protein?: number
  carbs?: number
  fat?: number
  saturatedFat?: number
  sugar?: number
}

type FoodItem = {
  id: string
  name: string
  category: string
  nutrition: Nutrition
}

type AddedFood = {
  id: string
  name: string
  quantity: string
  unit: string
  foodItem: FoodItem
}

export default function Home() {
  const [foodItems, setFoodItems] = React.useState<FoodItem[]>([])
  const [foodName, setFoodName] = React.useState('')
  const [foodValue, setFoodValue] = React.useState('')
  const [unitValue, setUnitValue] = React.useState('')
  const [quantityValue, setQuantityValue] = React.useState('')

  const [addedItems, setAddedItems] = React.useState<AddedFood[]>([])
  console.log('🚀 || Home || addedItems:', addedItems)

  const handleSubmit = () => {
    if (!foodValue || !quantityValue) {
      alert('Please select a food item and enter a quantity')
      return
    }

    const selectedFood = foodItems.find((item) => item.id === parseInt(foodValue))
    console.log('🚀 || handleSubmit || selectedFood:', selectedFood)
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
    <div className='container mx-auto px-6 w-full min-h-screen flex items-center justify-center flex-col gap-10'>
      <div className='w-full flex flex-col gap-5 lg:w-1/2'>
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
                  category: item.category,
                }))
                .sort((a, b) => a.category.toLowerCase().localeCompare(b.category.toLowerCase()))) ||
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
          className='p-5 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600 duration-100'
        >
          Submit
        </button>
      </div>

      <div className='w-2/3 h-[1px] bg-white rounded-full opacity-10' />

      <div className='w-full flex flex-col gap-4'>
        {addedItems.map((item) => (
          <div
            key={item.id}
            className='border w-full p-5 rounded-lg text-white flex justify-between tracking-wide'
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

        <div className='p-5 text-lg font-semibold flex justify-between bg-yellow-500 text-white rounded-lg'>
          <h3 className=''>Total</h3>
          <div className='flex gap-2'>
            {Object.entries(
              addedItems.reduce((acc, item) => {
                Object.entries(item.foodItem.nutrition).forEach(([key, value]) => {
                  if (acc[key]) {
                    acc[key] += value
                  } else {
                    acc[key] = value
                  }
                })
                return acc
              }, {} as Nutrition)
            ).map(([key, value]) => (
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
      </div>
    </div>
  )
}

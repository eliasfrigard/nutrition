'use client'

import React from 'react'
import Input from '@/components/Input'
import Select from '@/components/Select'
import NutritionView from '@/components/NutritionView'

import useStickyState from '@/hooks/useStickyState'
import type { FoodItem, AddedFood } from '@/types'

export default function Home() {
  const [foodItems, setFoodItems] = React.useState<FoodItem[]>([])
  const [selectedFood, setSelectedFood] = React.useState<FoodItem | null>(null)
  const [unitValue, setUnitValue] = React.useState('')
  const [quantityValue, setQuantityValue] = React.useState<number | null>(null)

  const [addedItems, setAddedItems] = useStickyState([] as AddedFood[], 'addedItems')

  const handleSubmit = () => {
    if (!selectedFood || !quantityValue) {
      alert('Please select a food item and enter a quantity')
      return
    }

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

    setQuantityValue(null)
  }

  const handleFoodSelect = (value: string) => {
    const selected = foodItems.find((item) => parseInt(item.id) === parseInt(value))
    setSelectedFood(selected || null)
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
    <>
      <div className='w-full flex flex-col gap-5 lg:w-2/3'>
        <Select
          value={selectedFood?.id}
          placeholder='Select Food...'
          onChange={(value) => handleFoodSelect(value)}
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
            type='number'
            className='w-2/3'
            value={quantityValue}
            setValue={(value) => setQuantityValue(value as number)}
            placeholder='Food Quantity...'
            onKeyUp={(e) => e.key === 'Enter' && handleSubmit()}
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
        <NutritionView
          items={addedItems}
          clearItems={setAddedItems([])}
        />
      )}
    </>
  )
}

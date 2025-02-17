'use client'

import React from 'react'
import Input from '@/components/Input'
import Select from '@/components/Select'

import useStickyState from '@/hooks/useStickyState'
import type { FoodItem, AddedFood, Nutrition } from '@/types'

export default function Home() {
  const [foodItems, setFoodItems] = React.useState<FoodItem[]>([])
  const [selectedFood, setSelectedFood] = React.useState<FoodItem | null>(null)
  const [unitValue, setUnitValue] = React.useState('')
  const [quantityValue, setQuantityValue] = React.useState<number>(0)

  const [addedItems, setAddedItems] = useStickyState([] as AddedFood[], 'addedItems')

  const totalNutrition = React.useMemo(() => {
    return addedItems.reduce((acc, item) => {
      const quantity = parseFloat(item.quantity)
      const factor = isNaN(quantity) ? 1 : quantity / 100

      Object.entries(item.foodItem.nutrition).forEach(([key, value]) => {
        const nutrientKey = key as keyof Nutrition
        acc[nutrientKey] = (acc[nutrientKey] || 0) + parseInt(value as string) * factor
      })
      return acc
    }, {} as { [key in keyof Nutrition]: number })
  }, [addedItems])

  const copyToClipboard = (nutrient: keyof Nutrition) => {
    const value = totalNutrition[nutrient] || 0
    navigator.clipboard.writeText(value.toFixed(2)).catch((err) => console.error('Failed to copy: ', err))
  }

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

    // Reset form fields
    setQuantityValue(0)
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
            placeholder='Type something...'
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
        <div className='w-full flex flex-col gap-4 -mt-6'>
          <div className='w-full text-white flex justify-end'>
            <button
              onClick={() => setAddedItems([])}
              className='p-3 rounded border border-opacity-40 border-white hover:border-opacity-100 cursor-pointer hover:bg-white hover:text-black duration-100 font-medium tracking-wide w-full md:max-w-[200px]'
            >
              <p>Clear All Values</p>
            </button>
          </div>

          {addedItems.map((item) => (
            <div
              key={item.id}
              className='border w-full p-5 rounded text-white flex flex-col md:flex-row gap-2 justify-between tracking-wide'
            >
              <div className='flex items-center gap-2'>
                <h3 className='font-semibold text-lg'>{item.name}</h3>
                <p className='text-sm'>({item.quantity}g)</p>
              </div>

              <div className='flex flex-col md:flex-row gap-2'>
                {Object.entries(item.foodItem.nutrition).map(([key, value]) => (
                  <div
                    key={key}
                    className='border-l pl-3 md:border-l-0 md:border-r border-opacity-50 md:pl-0 pr-2 border-yellow-500 justify-center items-center'
                  >
                    <p className='capitalize text-sm'>
                      {key}: {(parseInt(value as string) * (parseFloat(item.quantity) / 100)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className='p-5 text-lg font-semibold flex flex-col md:flex-row gap-1 justify-between items-center bg-yellow-500 text-white rounded'>
            <h3 className='text-xl font-bold border-b pb-3 md:pb-0 border-opacity-20 md:border-b-0'>Total</h3>
            <div className='flex gap-1 flex-col md:flex-row w-full md:w-auto'>
              {Object.entries(totalNutrition).map(([key, value]) => (
                <div
                  key={key}
                  className='border-b md:border-r md:pr-2 flex justify-between w-full border-white py-2 border-opacity-20 md:border-yellow-500'
                >
                  <p className='capitalize text-[16px]'>{key}:</p>
                  <p className='capitalize text-[16px]'>{parseInt(value as string).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='w-full text-white flex justify-end gap-3'>
            <button
              onClick={() => copyToClipboard('calories')}
              className='p-3 rounded border border-opacity-40 border-white hover:border-opacity-100 cursor-pointer hover:bg-white hover:text-black duration-100 font-medium tracking-wide w-1/2 md:max-w-[200px]'
            >
              <p>Calories</p>
            </button>
            <button
              onClick={() => copyToClipboard('protein')}
              className='p-3 rounded border border-opacity-40 border-white hover:border-opacity-100 cursor-pointer hover:bg-white hover:text-black duration-100 font-medium tracking-wide w-1/2 md:max-w-[200px]'
            >
              <p>Protein</p>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

import React from 'react'

import Button from '@/components/Button'
import type { AddedFood, Nutrition } from '../../types'
import NutritionItem from './NutritionItem'

const NutritionView = ({ items, clearItems }: { items: AddedFood[]; clearItems: () => void }) => {
  const copyToClipboard = (nutrient: keyof Nutrition) => {
    const value = totalNutrition[nutrient] || 0
    navigator.clipboard.writeText(value.toFixed(2)).catch((err) => console.error('Failed to copy: ', err))
  }

  const totalNutrition = React.useMemo(() => {
    return items.reduce((acc, item) => {
      const quantity = parseFloat(item.quantity)
      const factor = isNaN(quantity) ? 1 : quantity / 100

      Object.entries(item.foodItem.nutrition).forEach(([key, value]) => {
        const nutrientKey = key as keyof Nutrition
        acc[nutrientKey] = (acc[nutrientKey] || 0) + value * factor
      })
      return acc
    }, {} as { [key in keyof Nutrition]: number })
  }, [items])

  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='w-full text-white flex justify-end'>
        <Button
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all values?')) {
              clearItems()
            }
          }}
        >
          Clear All Values
        </Button>
      </div>

      {items.map((item) => (
        <NutritionItem
          key={item.id}
          name={item.name}
          quantity={parseInt(item.quantity)}
          foodItem={item.foodItem}
        />
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
              <p className='capitalize text-[16px]'>{value.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='w-full text-white flex justify-end gap-3'>
        <Button onClick={() => copyToClipboard('calories')}>Calories</Button>
        <Button onClick={() => copyToClipboard('protein')}>Protein</Button>
      </div>
    </div>
  )
}

export default NutritionView

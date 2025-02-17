import React from 'react'

import { FoodItem } from '@/types'

const NutritionItem = ({ name, quantity, foodItem }: { name: string; quantity: number; foodItem: FoodItem }) => {
  return (
    <div className='border w-full p-5 rounded text-white flex flex-col md:flex-row gap-2 justify-between tracking-wide'>
      <div className='flex items-center gap-2'>
        <h3 className='font-semibold text-lg'>{name}</h3>
        <p className='text-sm'>({quantity}g)</p>
      </div>

      <div className='flex flex-col md:flex-row gap-2'>
        {Object.entries(foodItem.nutrition).map(([key, value]) => (
          <div
            key={key}
            className='border-l pl-3 md:border-l-0 md:border-r border-opacity-50 md:pl-0 pr-2 border-yellow-500 justify-center items-center'
          >
            <p className='capitalize text-sm'>
              {key}: {((value * quantity) / 100).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NutritionItem

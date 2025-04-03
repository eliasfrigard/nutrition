import React from 'react'

import { FoodItem } from '@/types'

const NutritionItem = ({
  id,
  name,
  quantity,
  foodItem,
  removeItem,
}: {
  id: string
  name: string
  quantity: number
  foodItem: FoodItem
  removeItem: (id) => void
}) => {
  return (
    <div className='relative border w-full p-5 rounded text-white flex flex-col md:flex-row gap-2 justify-between tracking-wide'>
      <div className='flex items-center gap-2'>
        <h3 className='font-semibold text-lg'>{name}</h3>
        <p className='text-sm'>({quantity}g)</p>
      </div>

      <div className='flex flex-col md:flex-row gap-2 h-full justify-end sm:items-center'>
        {Object.entries(foodItem.nutrition).map(([key, value]) => (
          <div
            key={key}
            className='border-l pl-3 md:border-l-0 md:border-r border-opacity-50 md:pl-0 pr-2 border-yellow-500 justify-center sm:items-center h-full'
          >
            <p className='capitalize text-sm'>
              {key}: {((value * quantity) / 100).toFixed(2)}
            </p>
          </div>
        ))}

        <button
          onClick={() => removeItem(id)}
          className='ml-3 mt-2 sm:mt-0 h-6 w-6 flex items-center justify-center bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition font-bold text-sm'
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default NutritionItem

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
  quantity?: number
  foodItem: FoodItem
  removeItem?: (id) => void
}) => {
return (
    <div className='group relative bg-zinc-900/30 border border-zinc-800/50 p-4 rounded-xl flex flex-col gap-3 hover:border-zinc-700 transition-colors'>
      <div className='flex justify-between items-start'>
        <div>
          <h3 className='font-bold text-zinc-100'>{name}</h3>
          <p className='text-xs text-zinc-500 font-medium'>{quantity} Grams</p>
        </div>

        {removeItem && (
          <button
            onClick={() => removeItem(id)}
            className='opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-red-400 transition-all'
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        )}
      </div>

      <div className='grid grid-cols-4 gap-2 pt-2 border-t border-zinc-800/50'>
        {Object.entries(foodItem.nutrition).map(([key, value]) => (
          <div key={key} className="text-center">
            <p className='text-[10px] uppercase text-zinc-500 font-bold'>{key.substring(0, 3)}</p>
            <p className='text-sm text-amber-500/90 font-mono'>
              {quantity === undefined ? value : ((value * quantity) / 100).toFixed(1)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NutritionItem


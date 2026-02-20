import React from 'react'

import type { AddedFood } from '../../types'
import NutritionItem from './NutritionItem'
import NutritionTotal from './NutritionTotal'

const NutritionView = ({
  items,
  clearItems,
  removeItem,
}: {
  items: AddedFood[]
  clearItems: () => void
  removeItem: (id: string) => void
}) => {
  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='w-full text-white flex justify-end'>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all values?')) {
              clearItems()
            }
          }}
          className='w-full group flex items-center justify-center gap-3 py-4 px-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl text-zinc-400 font-bold hover:bg-red-900/10 hover:border-red-900/30 hover:text-red-400 transition-all active:scale-[0.98]'
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18" height="18"
            viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            className="group-hover:shake transition-transform"
          >
            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
          Clear All
        </button>
      </div>

      {items.map((item) => (
        <NutritionItem
          id={item.uuid}
          key={item.id}
          name={item.name}
          quantity={parseInt(item.quantity)}
          foodItem={item.foodItem}
          removeItem={removeItem}
        />
      ))}

      <NutritionTotal items={items} />
    </div>
  )
}

export default NutritionView

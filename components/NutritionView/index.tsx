import React from 'react'

import Button from '@/components/Button'
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
          id={item.id}
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

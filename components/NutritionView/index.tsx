import React from 'react'

import Button from '@/components/Button'
import type { AddedFood } from '../../types'
import NutritionItem from './NutritionItem'
import NutritionTotal from './NutritionTotal'

const NutritionView = ({ items, clearItems }: { items: AddedFood[]; clearItems: () => void }) => {
  console.log('🚀 || items:', items)
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

      <NutritionTotal items={items} />
    </div>
  )
}

export default NutritionView

'use client'

import React from 'react'
import Input from '@/components/Input'
import Select from '@/components/Select'
import NutritionView from '@/components/NutritionView'

import { createClient } from '@/utils/supabase/client'
import useStickyState from '@/hooks/useStickyState'
import type { FoodItem, AddedFood } from '@/types'

import { v4 as uuidv4 } from 'uuid'

const supabase = createClient()

export default function Home() {
  const [foodItems, setFoodItems] = React.useState<FoodItem[]>([])
  const [selectedFood, setSelectedFood] = React.useState<FoodItem | null>(null)
  const [quantityValue, setQuantityValue] = React.useState<number | null>(null)

  const [addedItems, setAddedItems] = useStickyState(
    [] as AddedFood[],
    'addedItems'
  )

  const handleSubmit = () => {
    if (!selectedFood || !quantityValue) {
      alert('Please select a food item and enter a quantity')
      return
    }

    setAddedItems((prev) => [
      ...prev,
      {
        uuid: uuidv4(),
        id: selectedFood.id,
        name: selectedFood.name,
        quantity: quantityValue,
        foodItem: selectedFood,
      },
    ])

    setQuantityValue(null)
  }

  const handleFoodSelect = (value: string) => {
    const selected = foodItems.find(
      (item) => parseInt(item.id) === parseInt(value)
    )
    setSelectedFood(selected || null)
  }

  const handleRemoveItem = (id: string) => {
    setAddedItems((prev) => prev.filter((item) => item.uuid !== id))
    setSelectedFood(null)
    setQuantityValue(null)
  }

  React.useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const { data, error } = await supabase
          .from('food_items')
          .select('*')

        if (error) {
          console.error('Error fetching food items:', error)
          return
        }

        const filtered = data?.filter(
          (item) => item.nutrition && Object.keys(item.nutrition).length > 0
        ) || []

        setFoodItems(filtered)
      } catch (err) {
        console.error('Unexpected error:', err)
      }
    }

    fetchFoodItems()
  }, [])

  return (
    <div className='w-full flex flex-col gap-6'>
      {/* Optional: Header branding */}
      <header className="text-center space-y-1 mb-2">
        <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
          Fuel<span className="text-amber-500">Log</span>
        </h1>
      </header>

      <div className='w-full bg-zinc-900/50 border border-zinc-800 backdrop-blur-md p-6 rounded-3xl shadow-2xl flex flex-col gap-5'>
        {/* Select Food Section */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.15em] ml-1">
            Search Food Item
          </label>
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
                    category: item.category,
                  }))
                  .sort((a, b) =>
                    a.label.toLowerCase().localeCompare(b.label.toLowerCase())
                  )) ||
              []
            }
          />
        </div>

        {/* Input Row: Standardized Heights */}
        <div className='grid grid-cols-2 gap-4'>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.15em] ml-1">
              Weight
            </label>
            <div className="relative group">
              <Input
                type='number'
                value={quantityValue}
                setValue={(value) => setQuantityValue(value as number)}
                placeholder='0.00'
                // Ensure your Input component accepts a className, or adjust its internal padding to match h-11
                className="h-11 pr-10"
                onKeyUp={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xs uppercase tracking-widest pointer-events-none">
                g
              </span>
            </div>
          </div>

          <div className="space-y-1.5 flex flex-col justify-end">
            {/* Using justify-end and h-11 to match the input box precisely */}
            <button
              onClick={handleSubmit}
              className='h-11 w-full bg-amber-500 text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all active:scale-[0.97] flex items-center justify-center gap-2'
            >
              <span>Add Entry</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </button>
          </div>
        </div>
      </div>

      {addedItems.length > 0 && (
        <NutritionView
          items={addedItems}
          clearItems={() => setAddedItems([])}
          removeItem={handleRemoveItem}
        />
      )}
    </div>
  )
}
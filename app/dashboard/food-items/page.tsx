'use client';

import React, { useEffect, useState } from 'react'
import Input from '@/components/Input'
import NutritionItem from '@/components/NutritionView/NutritionItem'
import { createClient } from '@/utils/supabase/client'
import type { Nutrition, FoodItem } from '@/types'

const supabase = createClient()

const nutritionKeys: (keyof Nutrition)[] = [
  'calories',
  'protein',
  'carbohydrates',
  'fat',
  'saturatedFat',
  'sugar',
  'fiber',
]

export default function FoodItemsDashboard() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [name, setName] = useState('')
  const [nutrition, setNutrition] = useState<Partial<Nutrition>>({
    calories: 0,
  })

  const fetchFoodItems = async () => {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .order('name', { ascending: true }) // Keep it organized

    if (error) {
      console.error('Supabase error:', error)
    } else {
      setFoodItems(data as FoodItem[])
    }
  }

  const addFoodItem = async () => {
    if (!name) return alert('Please enter a name')
    if (nutrition.calories === undefined) return alert('Calories are required')

    const { data, error } = await supabase.from('food_items').insert([
      {
        name,
        nutrition,
      },
    ]).select() // Select back the data to update local state

    if (error) {
      console.error('Insert error:', error)
    } else {
      setFoodItems(prev => [...prev, ...data].sort((a,b) => a.name.localeCompare(b.name)))
      setName('')
      setNutrition({ calories: 0 })
    }
  }

  useEffect(() => {
    fetchFoodItems()
  }, [])

  return (
    <div className='w-full flex flex-col gap-8 animate-in fade-in duration-700'>
      {/* 1. Page Header */}
      <header className="px-1">
        <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">
          Database <span className="text-amber-500">Manager</span>
        </h1>
        <p className="text-zinc-500 text-sm font-medium">Add and manage master food items</p>
      </header>

      {/* 2. Entry Form Card */}
      <div className='w-full bg-zinc-900/50 border border-zinc-800 backdrop-blur-md p-6 rounded-3xl shadow-2xl flex flex-col gap-6'>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.15em] ml-1">
            Food Item Name
          </label>
          <Input
            type="text"
            placeholder="Food Name"
            value={name}
            setValue={(value) => setName(String(value))}
            className="h-11"
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.15em] ml-1">
            Nutrition Profile (per 100g)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {nutritionKeys.map((key) => (
            <div key={key} className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-600 uppercase ml-1 truncate block">
                {key.replace(/([A-Z])/g, ' $1')}
              </span>
              <Input
                type="number"
                placeholder="0"
                value={nutrition[key] ?? ''}
                className="h-10 text-sm"
                setValue={(value) => {
                  // 1. Convert to string to safely check empty state and use parseFloat
                  const stringValue = String(value);

                  setNutrition({
                    ...nutrition,
                    [key]: stringValue === '' ? undefined : parseFloat(stringValue),
                  });
                }}
              />
            </div>
          ))}
          </div>
        </div>

        <button
          onClick={addFoodItem}
          className="w-full h-12 bg-amber-500 text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Register New Food
        </button>
      </div>

      {/* 3. Master List Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">
            Stored Items ({foodItems.length})
          </h2>
          <div className="h-[1px] flex-1 bg-zinc-800 mx-4" />
        </div>

        <div className="grid gap-3">
          {foodItems.map((item) => (
            <div key={item.id} className="opacity-80 hover:opacity-100 transition-opacity">
              <NutritionItem
                id={item.id}
                name={item.name}
                foodItem={item}
                // removeItem={...} // Add delete logic here if you want to be able to delete from the DB
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

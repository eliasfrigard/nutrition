'use client'

import React from 'react'
import { NextPage } from 'next'
import Input from '@/components/Input'

import type { FoodItem } from '@/types'

interface Result {
  id: string
  name: string
  grams: number
  totalCalories: number
}

const TranslatorPage: NextPage = () => {
  const [foodItems, setFoodItems] = React.useState<FoodItem[]>([])
  const [targetCalories, setTargetCalories] = React.useState<number>(0)
  const [targetProtein, setTargetProtein] = React.useState<number>(0)
  const [results, setResults] = React.useState<Result[]>([])

  React.useEffect(() => {
    fetch('/foodItems.json')
      .then((res) => res.json())
      .then((data) => {
        setFoodItems(data)
      })
      .catch((error) => console.error('Error fetching food items:', error))
  }, [])

  const handleSubmit = () => {
    const matchingResults: Result[] = foodItems.reduce(
      (acc: Result[], item) => {
        const { nutrition } = item
        if (!nutrition || nutrition.protein === 0) return acc

        const { calories, protein } = nutrition

        const servingsRequired = targetProtein / protein
        const totalCalories = servingsRequired * calories

        if (totalCalories <= targetCalories) {
          const gramsRequired = servingsRequired * 100
          acc.push({
            id: item.id,
            name: item.name,
            grams: Math.floor(gramsRequired),
            totalCalories: Math.floor(totalCalories),
          })
        }

        return acc
      },
      []
    )

    setResults(matchingResults)
  }

  return (
    <>
      <div className='w-full flex flex-col gap-5 lg:w-2/3'>
        <Input
          type='number'
          placeholder='Target Protein'
          value={targetProtein}
          setValue={(value) => setTargetProtein(value as number)}
        />

        <Input
          type='number'
          placeholder='Target Calories'
          value={targetCalories}
          setValue={(value) => setTargetCalories(value as number)}
        />

        <button
          onClick={handleSubmit}
          className='p-5 bg-yellow-500 text-white rounded font-bold hover:bg-yellow-600 duration-100'
        >
          Submit
        </button>

        {results.length > 0 && (
          <div className='w-full'>
            {results.map((item) => (
              <div
                key={item.id}
                className='text-center py-2 border-b border-opacity-10 flex justify-between items-center flex-col sm:flex-row'
              >
                <p className='font-semibold'>{item.name}</p>
                <p>
                  {item.grams} grams, {item.totalCalories} calories
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default TranslatorPage

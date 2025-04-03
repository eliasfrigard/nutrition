'use client'

import React from 'react'
import { NextPage } from 'next'

import Input from '@/components/Input'
import Select from '@/components/Select'

import type { FoodItem } from '@/types'

const TranslatorPage: NextPage = () => {
  const [foodItems, setFoodItems] = React.useState<FoodItem[]>([])
  const [selectedFood, setSelectedFood] = React.useState<FoodItem | null>(null)
  const [targetCalories, setTargetCalories] = React.useState<number>(0)
  const [factor, setFactor] = React.useState<number>(0)

  React.useEffect(() => {
    fetch('/foodItems.json')
      .then((res) => res.json())
      .then((data) => {
        setFoodItems(data)
      })
      .catch((error) => console.error('Error fetching food items:', error))
  }, [])

  const handleSubmit = () => {
    if (!selectedFood) return

    const { nutrition } =
      foodItems.find((item) => item.id === selectedFood.id) || {}
    const { calories } = nutrition

    setFactor(targetCalories / calories)
  }

  const handleFoodSelect = (value: string) => {
    const selected = foodItems.find(
      (item) => parseInt(item.id) === parseInt(value)
    )
    setSelectedFood(selected || null)
  }

  return (
    <>
      <div className='w-full flex flex-col gap-5 lg:w-2/3'>
        <Select
          value={selectedFood?.id}
          onChange={(value) => handleFoodSelect(value)}
          options={
            (foodItems.length &&
              foodItems
                .map((item) => ({
                  value: item.id,
                  label: item.name,
                }))
                .sort((a, b) =>
                  a.label.toLowerCase().localeCompare(b.label.toLowerCase())
                )) ||
            []
          }
        />

        <Input
          type='number'
          value={targetCalories}
          setValue={(value) => setTargetCalories(value as number)}
        />

        <button
          onClick={handleSubmit}
          className='p-4 bg-yellow-500 text-white rounded font-bold hover:bg-yellow-600 duration-100'
        >
          Submit
        </button>

        {selectedFood && factor && (
          <div className='w-full text-center font-medium tracking-wide text-white rounded'>
            <h3>
              You can eat{' '}
              <b>
                <u className='text-lg'>{Math.floor(factor * 100)} grams</u>
              </b>{' '}
              of{' '}
              <b>
                <u className='text-lg'>{selectedFood.name}</u>
              </b>{' '}
              to reach your target!
            </h3>
            <div className='flex gap-2'></div>
          </div>
        )}
      </div>
    </>
  )
}

export default TranslatorPage

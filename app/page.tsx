'use client'

import React from 'react'
import Input from '@/components/Input'
import Select from '@/components/Select'

export default function Home() {
  const [foodItems, setFoodItems] = React.useState([])
  const [nameValue, setNameValue] = React.useState('')
  const [foodValue, setFoodVlaue] = React.useState('')
  const [unitValue, setUnitValue] = React.useState('')
  const [quantityValue, setQuantityValue] = React.useState('')

  const handleSubmit = () => {}

  React.useEffect(() => {
    fetch('/foodItems.json')
      .then((res) => res.json())
      .then((data) => {
        setFoodItems(data)
        console.log('🚀 || Home || foodItems:', data)
      })
      .catch((error) => console.error('Error fetching food items:', error))
  }, [])

  return (
    <div className='container mx-auto px-6 w-full min-h-screen flex items-center justify-center'>
      <div className='w-full flex flex-col gap-5 lg:w-1/2'>
        <Input
          value={nameValue}
          onChange={(event) => setNameValue(event.target.value)}
        />

        <Select
          value='1'
          onChange={(value) => console.log(value)}
          options={
            (foodItems.length &&
              foodItems.map((item) => ({
                value: item.id,
                label: item.name,
              }))) ||
            []
          }
        />

        <div className='flex gap-4'>
          <Input
            className='w-2/3'
            value={nameValue}
            onChange={(event) => setNameValue(event.target.value)}
            placeholder='Type something...'
          />
          <Select
            value='1'
            className='w-1/3'
            placeholder='Select Unit'
            onChange={(value) => console.log(value)}
            options={[{ value: 'g', label: 'Grams (g)' }]}
          />
        </div>

        <button className='p-5 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600 duration-100'>
          Submit
        </button>
      </div>
    </div>
  )
}

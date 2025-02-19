import React from 'react'

import Button from '@/components/Button'
import Select from '@/components/Select'
import { AddedFood, Nutrition } from '@/types'

const NutritionTotal = ({ items }: { items: AddedFood[] }) => {
  const [numberOfPortions, setNumberOfPortions] = React.useState<number | null>(null)

  const portionOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => ({
    value: value.toString(),
    label: value.toString(),
  }))

  const copyToClipboard = (nutrient: keyof Nutrition) => {
    const value = totalNutrition[nutrient] || 0
    navigator.clipboard.writeText(value.toFixed(2)).catch((err) => console.error('Failed to copy: ', err))
  }

  const totalNutrition = React.useMemo(() => {
    return items.reduce((acc, item) => {
      const quantity = parseFloat(item.quantity)
      const factor = isNaN(quantity) ? 1 : quantity / 100

      Object.entries(item.foodItem.nutrition).forEach(([key, value]) => {
        const nutrientKey = key as keyof Nutrition
        acc[nutrientKey] = (acc[nutrientKey] || 0) + value * factor
      })
      return acc
    }, {} as { [key in keyof Nutrition]: number })
  }, [items])

  const exportToCSV = () => {
    // Collect all the unique keys.
    const nutrientSet = new Set<string>()

    items.forEach((item) => {
      Object.keys(item.foodItem.nutrition).forEach((key) => nutrientSet.add(key))
    })

    // Convert keys to an array.
    const nutrientKeys = Array.from(nutrientSet)

    // Define the CSV headers.
    const headers = ['Name', 'Quantity', ...nutrientKeys]

    // Create CSV rows for each food item.
    const rows = items.map((item) => {
      const quantity = parseFloat(item.quantity)

      const nutrientValues = nutrientKeys.map((key) => {
        if (item.foodItem.nutrition[key] === undefined) return ''

        return ((item.foodItem.nutrition[key] * quantity) / 100).toFixed(2)
      })

      return [item.name, item.quantity, ...nutrientValues].join(',')
    })

    // Create row of total values.
    const totalsRowValues = nutrientKeys.map((key) => {
      const total = totalNutrition[key]
      return total !== undefined ? total.toFixed(2) : ''
    })

    const totalsRow = ['Total', '', ...totalsRowValues].join(',')

    // Combine headers, item rows, and the totals row.
    const csvContent = [headers.join(','), ...rows, totalsRow].join('\n')

    // Create a blob and trigger download.
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'nutrition-data.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <div className='p-5 text-lg font-semibold flex flex-col md:flex-row gap-1 justify-between items-center bg-yellow-500 text-white rounded'>
        <h3 className='text-xl font-bold border-b pb-3 md:pb-0 border-opacity-20 md:border-b-0'>Total</h3>
        <div className='flex gap-1 flex-col md:flex-row w-full md:w-auto'>
          {Object.entries(totalNutrition).map(([key, value]) => (
            <div
              key={key}
              className='border-b md:border-r md:pr-2 flex justify-between w-full border-white py-2 border-opacity-20 md:border-yellow-500'
            >
              <p className='capitalize text-[16px]'>{key}:</p>
              <p className='capitalize text-[16px]'>{value.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='w-full text-white flex justify-end gap-3'>
        <div>
          <Select
            value={numberOfPortions?.toString() || ''}
            onChange={(value) => setNumberOfPortions(parseInt(value))}
            options={portionOptions}
            placeholder='Number of Portions'
          />
        </div>

        <Button onClick={() => copyToClipboard('calories')}>Calories</Button>
        <Button onClick={() => copyToClipboard('protein')}>Protein</Button>
        <Button onClick={exportToCSV}>Export as CSV</Button>
      </div>

      {/* Print total values divided by number of portions */}
      {numberOfPortions && (
        <div className='py-3 px-5 text-lg font-semibold flex flex-col md:flex-row gap-1 justify-between items-center text-white rounded border border-opacity-20'>
          <h3 className='text-lg font-bold border-b pb-3 md:pb-0 border-opacity-20 md:border-b-0 underline'>
            Per Portion
          </h3>
          <div className='flex gap-1 flex-col md:flex-row w-full md:w-auto'>
            {Object.entries(totalNutrition).map(([key, value]) => (
              <div
                key={key}
                className='md:pr-2 flex justify-between w-full py-2'
              >
                <p className='capitalize text-[16px]'>{key}:</p>
                <p className='capitalize text-[16px]'>{(value / numberOfPortions).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default NutritionTotal

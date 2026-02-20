'use client'

import React from 'react'
import Select from '@/components/Select'
import { AddedFood, Nutrition } from '@/types'

const NutritionTotal = ({ items }: { items: AddedFood[] }) => {
  const [numberOfPortions, setNumberOfPortions] = React.useState<number | null>(null)

  const portionOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => ({
    value: value.toString(),
    label: `${value} Portions`,
  }))

  const totalNutrition = React.useMemo(() => {
    return items.reduce((acc, item) => {
      const quantity = parseFloat(item.quantity)
      const factor = isNaN(quantity) ? 1 : quantity / 100

      Object.entries(item.foodItem.nutrition).forEach(([key, value]) => {
        const nutrientKey = key as keyof Nutrition
        acc[nutrientKey] = (acc[nutrientKey] || 0) + (value as number) * factor
      })
      return acc
    }, {} as { [key in keyof Nutrition]: number })
  }, [items])

  const copyToClipboard = (nutrient: keyof Nutrition) => {
    const value = totalNutrition[nutrient] || 0
    navigator.clipboard
      .writeText(value.toFixed(2))
      .then(() => alert(`${nutrient} copied!`))
      .catch((err) => console.error('Failed to copy: ', err))
  }

  const exportToCSV = () => {
    const nutrientSet = new Set<string>()
    items.forEach((item) => {
      Object.keys(item.foodItem.nutrition).forEach((key) => nutrientSet.add(key))
    })
    const nutrientKeys = Array.from(nutrientSet)
    const headers = ['Name', 'Quantity', ...nutrientKeys]
    const rows = items.map((item) => {
      const quantity = parseFloat(item.quantity)
      const nutrientValues = nutrientKeys.map((key) => {
        if (item.foodItem.nutrition[key] === undefined) return ''
        return ((item.foodItem.nutrition[key] * quantity) / 100).toFixed(2)
      })
      return [item.name, item.quantity, ...nutrientValues].join(',')
    })
    const totalsRowValues = nutrientKeys.map((key) => {
      const total = totalNutrition[key as keyof Nutrition]
      return total !== undefined ? total.toFixed(2) : ''
    })
    const totalsRow = ['Total', '', ...totalsRowValues].join(',')
    const csvContent = [headers.join(','), ...rows, totalsRow].join('\n')
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
    <div className='w-full space-y-6 mt-8'>
      {/* 1. Main Dashboard Card */}
      <div className='bg-amber-500 p-6 rounded-2xl shadow-2xl shadow-amber-500/10 text-black relative overflow-hidden'>
        {/* Decorative pattern for a premium feel */}
        <div className='absolute right-[-10%] top-[-10%] w-32 h-32 bg-white/10 rounded-full blur-3xl' />

        <div className='flex justify-between items-center mb-6'>
          <div>
            <h3 className='text-[10px] uppercase tracking-[0.2em] font-black opacity-60 leading-none'>Total Intake</h3>
          </div>
          <div className='h-1.5 w-12 bg-black/20 rounded-full' />
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4'>
          {Object.entries(totalNutrition).map(([key, value]) => (
            <div key={key} className='flex flex-col border-l-2 border-black/10 pl-3'>
              <span className='capitalize text-[11px] font-bold opacity-70 mb-1'>{key}</span>
              <span className='text-3xl font-black tracking-tighter leading-none'>
                {value.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Per Portion Breakdown (Conditional) */}
      {numberOfPortions && (
        <div className='bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm p-5 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300'>
          <div className='flex items-center gap-2 mb-4'>
            <div className='h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' />
            <h3 className='text-xs uppercase font-bold text-zinc-400 tracking-widest'>Per Portion ({numberOfPortions})</h3>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {Object.entries(totalNutrition).map(([key, value]) => (
              <div key={key} className='flex justify-between md:flex-col border-b border-zinc-800/50 md:border-b-0 pb-2 md:pb-0'>
                <span className='capitalize text-xs text-zinc-500'>{key}</span>
                <span className='text-lg font-mono text-zinc-100 font-semibold'>
                  {(value / numberOfPortions).toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Utility / Action Bar */}
      <div className='flex flex-col sm:flex-row items-center gap-4 bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800/50'>
        <div className='w-full sm:flex-1'>
          <Select
            value={numberOfPortions?.toString() || ''}
            onChange={(value) => setNumberOfPortions(parseInt(value))}
            options={portionOptions}
            placeholder='Split into portions...'
          />
        </div>

        <div className='flex items-center gap-2 w-full sm:w-auto justify-center'>
          {/* Copy Calories */}
          <button
            onClick={() => copyToClipboard('calories' as keyof Nutrition)}
            className='flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all text-xs font-bold'
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            Cal
          </button>

          {/* Copy Protein */}
          <button
            onClick={() => copyToClipboard('protein' as keyof Nutrition)}
            className='flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all text-xs font-bold'
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            Prot
          </button>

          {/* Export CSV */}
          <button
            onClick={exportToCSV}
            className='flex-1 sm:flex-none flex items-center justify-center p-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-xl transition-all border border-amber-500/20'
            title="Export CSV"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NutritionTotal

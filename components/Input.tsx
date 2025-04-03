import React from 'react'

interface InputProps {
  value: string | number
  setValue: (value: string | number) => void
  placeholder?: string
  type?: string
  className?: string
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

const Input: React.FC<InputProps> = ({
  value,
  setValue,
  placeholder = '',
  type = 'text',
  className = '',
  onKeyUp,
}) => {
  console.log('🚀 || value:', value)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = event.target.value

    if (type === 'number') {
      setValue(inputVal === '' ? '' : Number(inputVal))
    } else {
      setValue(inputVal)
    }
  }

  return (
    <input
      onKeyUp={onKeyUp}
      type={type}
      value={value || ''}
      onChange={handleChange}
      placeholder={placeholder}
      className={`p-4 rounded text-black font-bold w-full ${className}`}
    />
  )
}

export default Input

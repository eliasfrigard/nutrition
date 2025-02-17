import React from 'react'

interface InputProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  className?: string
}

const Input: React.FC<InputProps> = ({ value, onChange, placeholder = '', type = 'text', className }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`p-5 rounded text-black font-bold w-full ${className}`}
    />
  )
}

export default Input

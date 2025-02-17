import React from 'react'

interface SelectProps {
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  value: string
  label?: string
  className?: string
  placeholder?: string
}

const Select: React.FC<SelectProps> = ({ options, onChange, value, className, placeholder }) => {
  return (
    <select
      className={`p-5 rounded-lg text-black font-bold w-full ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {placeholder && (
        <option
          value=''
          disabled
          selected={!value}
        >
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default Select

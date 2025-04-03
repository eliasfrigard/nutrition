import React, { useState } from 'react'
import Select from 'react-select'

interface SelectProps {
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  value: string | null
  placeholder?: string
  className?: string
}

const FuzzySelect: React.FC<SelectProps> = ({
  options,
  onChange,
  value,
  className,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState('')

  // Filter options based on fuzzy search
  const filteredOptions =
    inputValue.length > 0
      ? options.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      : []

  return (
    <Select
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          padding: 5,
          borderRadius: '0.375rem',
          width: '100%',
          color: 'black',
        }),
      }}
      className={`text-black font-bold w-full ${className}`}
      value={options.find((opt) => opt.value === value) || null}
      onChange={(selected) => onChange(selected?.value || '')}
      options={filteredOptions}
      onInputChange={(val) => setInputValue(val)}
      placeholder={placeholder || 'Select an option'}
      isClearable
      noOptionsMessage={() =>
        inputValue.length === 0
          ? 'Start typing to see options...'
          : 'No matches found'
      }
    />
  )
}

export default FuzzySelect

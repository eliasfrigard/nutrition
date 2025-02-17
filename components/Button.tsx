import React from 'react'

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

const Button: React.FC<ButtonProps> = ({ onClick, children, disabled = false, className }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-3 rounded border border-opacity-40 border-white hover:border-opacity-100 cursor-pointer hover:bg-white hover:text-black duration-100 font-medium tracking-wide w-full md:max-w-[200px] ${className}`}
    >
      {children}
    </button>
  )
}

export default Button

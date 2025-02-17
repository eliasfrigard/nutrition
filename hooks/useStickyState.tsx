import { useEffect, useState } from 'react'

const useStickyState = (defaultValue, key: string) => {
  const [value, setValue] = useState(defaultValue)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      const stickyValue = window.localStorage.getItem(key)
      if (stickyValue !== null) {
        setValue(JSON.parse(stickyValue))
      }
    }
  }, [isClient, key])

  useEffect(() => {
    if (isClient) {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  }, [isClient, value, key])

  return [value, setValue]
}

export default useStickyState

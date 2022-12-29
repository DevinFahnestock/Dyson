import { useState } from 'react'

const useOffset = (value: number) => {
  const [offset, setOffset] = useState<number>(value)
  return [offset, setOffset] as [number, any]
}

export default useOffset

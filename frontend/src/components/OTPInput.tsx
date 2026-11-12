import { useRef, useState, useEffect } from 'react'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''))

  useEffect(() => {
    const arr = value.split('').slice(0, length)
    while (arr.length < length) arr.push('')
    setDigits(arr)
  }, [value, length])

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const newDigits = [...digits]
    newDigits[index] = val.slice(-1)
    setDigits(newDigits)
    onChange(newDigits.join(''))
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    const newDigits = pasted.split('').concat(Array(length).fill(''))
    const result = newDigits.slice(0, length)
    setDigits(result)
    onChange(result.join(''))
    const focusIndex = Math.min(pasted.length, length - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-11 h-14 text-center text-xl font-bold bg-navy-800 border-2 rounded-lg text-white transition-all duration-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50 border-navy-500 caret-accent"
        />
      ))}
    </div>
  )
}

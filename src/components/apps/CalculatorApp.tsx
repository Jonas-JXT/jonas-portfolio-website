'use client'
import { useState, useCallback } from 'react'

type Op = '+' | '-' | '×' | '÷' | null

export default function CalculatorApp() {
  const [display, setDisplay] = useState('0')
  const [operand, setOperand] = useState<number | null>(null)
  const [op, setOp] = useState<Op>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const pressDigit = useCallback(
    (digit: string) => {
      if (waitingForOperand) {
        setDisplay(digit)
        setWaitingForOperand(false)
      } else {
        setDisplay(display === '0' ? digit : display + digit)
      }
    },
    [display, waitingForOperand]
  )

  const pressDot = useCallback(() => {
    if (waitingForOperand) { setDisplay('0.'); setWaitingForOperand(false); return }
    if (!display.includes('.')) setDisplay(display + '.')
  }, [display, waitingForOperand])

  const pressOp = useCallback(
    (nextOp: Op) => {
      const cur = parseFloat(display)
      if (operand !== null && op && !waitingForOperand) {
        const result = calculate(operand, cur, op)
        setDisplay(String(result))
        setOperand(result)
      } else {
        setOperand(cur)
      }
      setOp(nextOp)
      setWaitingForOperand(true)
    },
    [display, operand, op, waitingForOperand]
  )

  const pressEquals = useCallback(() => {
    if (operand === null || !op) return
    const cur = parseFloat(display)
    const result = calculate(operand, cur, op)
    setDisplay(String(result))
    setOperand(null)
    setOp(null)
    setWaitingForOperand(true)
  }, [display, operand, op])

  const pressClear = useCallback(() => {
    setDisplay('0')
    setOperand(null)
    setOp(null)
    setWaitingForOperand(false)
  }, [])

  const pressToggleSign = useCallback(() => {
    setDisplay(String(-parseFloat(display)))
  }, [display])

  const pressPercent = useCallback(() => {
    setDisplay(String(parseFloat(display) / 100))
  }, [display])

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] p-1 gap-1">
      {/* Display */}
      <div className="flex-none px-3 py-3 text-right">
        <p className="text-white text-[2rem] font-light leading-none tracking-tight truncate">
          {display.length > 10 ? parseFloat(display).toPrecision(8) : display}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex-1 grid grid-cols-4 gap-1">
        {/* Row 1 */}
        <CalcBtn label="C" variant="gray" onClick={pressClear} />
        <CalcBtn label="+/-" variant="gray" onClick={pressToggleSign} />
        <CalcBtn label="%" variant="gray" onClick={pressPercent} />
        <CalcBtn label="÷" variant="orange" onClick={() => pressOp('÷')} active={op === '÷'} />
        {/* Row 2 */}
        {['7','8','9'].map(d => <CalcBtn key={d} label={d} variant="dark" onClick={() => pressDigit(d)} />)}
        <CalcBtn label="×" variant="orange" onClick={() => pressOp('×')} active={op === '×'} />
        {/* Row 3 */}
        {['4','5','6'].map(d => <CalcBtn key={d} label={d} variant="dark" onClick={() => pressDigit(d)} />)}
        <CalcBtn label="-" variant="orange" onClick={() => pressOp('-')} active={op === '-'} />
        {/* Row 4 */}
        {['1','2','3'].map(d => <CalcBtn key={d} label={d} variant="dark" onClick={() => pressDigit(d)} />)}
        <CalcBtn label="+" variant="orange" onClick={() => pressOp('+')} active={op === '+'} />
        {/* Row 5 */}
        <CalcBtn label="0" variant="dark" wide onClick={() => pressDigit('0')} />
        <CalcBtn label="." variant="dark" onClick={pressDot} />
        <CalcBtn label="=" variant="orange" onClick={pressEquals} />
      </div>
    </div>
  )
}

function calculate(a: number, b: number, op: Op): number {
  switch (op) {
    case '+': return a + b
    case '-': return a - b
    case '×': return a * b
    case '÷': return b !== 0 ? a / b : 0
    default: return b
  }
}

function CalcBtn({
  label, variant, wide, active, onClick,
}: {
  label: string
  variant: 'gray' | 'dark' | 'orange'
  wide?: boolean
  active?: boolean
  onClick: () => void
}) {
  const base = 'flex items-center justify-center text-[16px] font-light rounded-full cursor-pointer select-none transition-all active:brightness-90'
  const colors = {
    gray:   'bg-[#a5a5a5] text-black hover:bg-[#b5b5b5]',
    dark:   'bg-[#333333] text-white hover:bg-[#444444]',
    orange: `${active ? 'bg-white text-[#ff9500]' : 'bg-[#ff9500] text-white hover:bg-[#ffaa30]'}`,
  }
  return (
    <button
      onClick={onClick}
      className={`${base} ${colors[variant]} ${wide ? 'col-span-2' : ''}`}
    >
      {label}
    </button>
  )
}

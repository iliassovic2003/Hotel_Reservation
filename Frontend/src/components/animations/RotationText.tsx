import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'

interface RotatingTextProps {
  texts: string[]
  mainClassName?: string
  splitLevelClassName?: string
  staggerFrom?: 'first' | 'last' | 'center'
  initial?: any
  animate?: any
  exit?: any
  transition?: any
  staggerDuration?: number
  rotationInterval?: number
  textColor?: string
}

const RotatingText = ({
  texts,
  mainClassName = '',
  splitLevelClassName = '',
  staggerFrom = 'first',
  initial = { y: '100%' },
  animate = { y: 0 },
  exit = { y: '-120%' },
  transition = { duration: 0.3 },
  staggerDuration = 0.015,
  rotationInterval = 2000,
  textColor = '#000000',
}: RotatingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length)
    }, rotationInterval)
    return () => clearInterval(interval)
  }, [texts.length, rotationInterval])

  const currentText = texts[currentIndex]
  const letters = currentText.split('')

  const getStaggerDelay = (index: number) => {
    if (staggerFrom === 'first') return index * staggerDuration
    if (staggerFrom === 'last') return (letters.length - 1 - index) * staggerDuration
    const middle = Math.floor(letters.length / 2)
    return Math.abs(middle - index) * staggerDuration
  }

  return (
    <div className={mainClassName} style={{ color: textColor }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          style={{ display: 'inline-flex', color: textColor }}
        >
          {letters.map((letter, i) => (
            <div key={i} className={splitLevelClassName}>
              <motion.span
                initial={initial}
                animate={animate}
                exit={exit}
                transition={{
                  ...transition,
                  delay: getStaggerDelay(i),
                }}
                style={{ display: 'inline-block', color: textColor }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default RotatingText
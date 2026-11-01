import { motion, useReducedMotion } from 'motion/react'
import * as React from 'react'

export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const still = useReducedMotion() ?? false

  return (
    <motion.div
      className={className}
      initial={still ? false : { opacity: 0, y: 16 }}
      whileInView={still ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

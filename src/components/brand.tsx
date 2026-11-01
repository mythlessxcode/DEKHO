import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="DEKHO home"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        className,
      )}
    >
      <FilmCamera />
      <span className="font-onest text-xl font-medium tracking-tight">DEKHO</span>
    </Link>
  )
}

function FilmCamera() {
  const still = useReducedMotion() ?? false

  return (
    <motion.svg
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="size-8 shrink-0 text-foreground"
      initial={{ rotate: 0 }}
      animate={still ? undefined : { rotate: [-3, 3, -3] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.g
        style={{ transformOrigin: '13px 11.5px' }}
        animate={still ? undefined : { rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="13" cy="11.5" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="13" cy="11.5" r="1.6" fill="currentColor" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={deg}
            x1="13"
            y1="11.5"
            x2={13 + Math.cos((deg * Math.PI) / 180) * 4.2}
            y2={11.5 + Math.sin((deg * Math.PI) / 180) * 4.2}
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}
      </motion.g>

      <motion.g
        style={{ transformOrigin: '27px 11.5px' }}
        animate={still ? undefined : { rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="27" cy="11.5" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="27" cy="11.5" r="1.6" fill="currentColor" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={deg}
            x1="27"
            y1="11.5"
            x2={27 + Math.cos((deg * Math.PI) / 180) * 4.2}
            y2={11.5 + Math.sin((deg * Math.PI) / 180) * 4.2}
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}
      </motion.g>

      <rect x="8.5" y="17.5" width="17" height="13" rx="2.2" fill="currentColor" />
      <rect x="25" y="21" width="7.5" height="7" rx="1.4" fill="currentColor" />
      <motion.circle
        cx="32.4"
        cy="24.5"
        r="3.1"
        fill="#FF7D0C"
        animate={still ? undefined : { scale: [1, 1.08, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '32.4px 24.5px' }}
      />
      <circle cx="32.4" cy="24.5" r="1.15" fill="#1a1a1a" />
      <rect x="11.5" y="20.2" width="5.5" height="3.2" rx="0.6" fill="#0a0a0a" opacity="0.35" />
    </motion.svg>
  )
}

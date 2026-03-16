import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export default function HeartRateGraph({ bpm, isCalming = false, className = '' }) {
  // Generate data points for the graph
  const generateData = () => {
    const points = []
    const baseBPM = isCalming ? 70 : 140
    const variance = isCalming ? 10 : 20
    
    for (let i = 0; i < 100; i++) {
      const progress = i / 100
      let currentBPM
      
      if (isCalming) {
        // Smooth transition from high to low
        const targetBPM = 70 + Math.sin(progress * Math.PI * 2) * 5
        currentBPM = targetBPM + (Math.random() - 0.5) * variance
      } else {
        // High panic state
        currentBPM = baseBPM + Math.sin(progress * Math.PI * 4) * 15 + (Math.random() - 0.5) * variance
      }
      
      points.push({
        x: (i / 100) * 400,
        y: 200 - ((currentBPM - 60) / 80) * 200
      })
    }
    
    return points
  }

  const points = generateData()
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div className={`relative ${className}`}>
      <div className="h-64 bg-clinical-soft rounded-lg p-4 relative overflow-hidden">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 400 200" 
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 50, 100, 150, 200].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="400"
              y2={y}
              stroke="#E0E0E0"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Heart rate line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke={isCalming ? '#4A90A4' : '#EF4444'}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          
          {/* Pulse effect */}
          {!isCalming && (
            <motion.circle
              cx={points[points.length - 1]?.x || 400}
              cy={points[points.length - 1]?.y || 100}
              r="4"
              fill="#EF4444"
              animate={{ r: [4, 8, 4], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </svg>
        
        {/* BPM Display */}
        <div className="absolute top-4 right-4">
          <motion.div
            className={`flex items-center gap-2 ${isCalming ? 'text-clinical-primary' : 'text-red-500'}`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: !isCalming ? Infinity : 0 }}
          >
            <Heart className="w-5 h-5" />
            <span className="font-bold text-lg">
              {Math.round(bpm)} BPM
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

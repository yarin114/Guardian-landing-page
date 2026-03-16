import { motion } from 'framer-motion'
import { 
  User, 
  GraduationCap, 
  Sparkles, 
  Flame, 
  UserCog,
  Heart,
  Brain,
  Wind
} from 'lucide-react'

const iconMap = {
  'soldier': User,
  'hat': User,
  'student': GraduationCap,
  'notebook': GraduationCap,
  'firework': Sparkles,
  'explosion': Sparkles,
  'bonfire': Flame,
  'masked-figure': UserCog,
  'breathing': Wind,
  'cognitive': Brain,
  'grounding': Heart
}

export default function LottiePlaceholder({ type, size = 'large', className = '' }) {
  const Icon = iconMap[type] || User
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
    xlarge: 'w-64 h-64'
  }

  return (
    <motion.div
      className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
          <Icon className={`${sizeClasses[size]} text-clinical-primary opacity-60`} />
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 bg-white px-2 py-1 rounded">
          Lottie
        </div>
      </div>
    </motion.div>
  )
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import LottieAnimation from './LottieAnimation';

interface LoadingScreenProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export default function LoadingScreen({ isLoading, onComplete }: LoadingScreenProps) {
  return (
    <AnimatePresence mode="wait" onExitComplete={onComplete}>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Brand name */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-serif tracking-[0.3em]"
            >
              SOCIALE
            </motion.span>
            
            {/* Loading animation */}
            <div className="w-16 h-16">
              <LottieAnimation type="loading" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Mini loading spinner for buttons/inline use
export function LoadingSpinner({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <div style={{ width: size, height: size }} className={className}>
      <LottieAnimation type="loading" />
    </div>
  );
}

// Success animation for form confirmations
export function SuccessAnimation({ 
  show, 
  onComplete,
  message = 'Success!'
}: { 
  show: boolean; 
  onComplete?: () => void;
  message?: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16">
            <LottieAnimation 
              type="success" 
              loop={false}
              onComplete={onComplete}
            />
          </div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-black/60"
          >
            {message}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

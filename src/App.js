import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isMoving, setIsMoving] = useState(false);
  const moveTimeout = useRef(null);

  const handleMouseMove = useCallback(
    throttle((event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
      setIsMoving(true);
      clearTimeout(moveTimeout.current);
      moveTimeout.current = setTimeout(() => setIsMoving(false), 200);
    }, 10), // Reduced throttle time
    []
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(moveTimeout.current);
    };
  }, [handleMouseMove]);
  const particles = useMemo(() => Array.from({ length: 2000 }).map(() => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 0.5 + 0.2,
    speed: Math.random() * 0.01 + 0.005,
    direction: Math.random() * 2 - 1 // Add random direction
  })), []);
  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute bg-white rounded-full will-change-transform"
          style={{
            width: particle.size,
            height: particle.size,
            top: particle.y,
            left: particle.x,
            opacity: 0.15,
          }}
          animate={{
            x: (mousePosition.x - particle.x) * particle.speed * particle.direction,
            y: (mousePosition.y - particle.y) * particle.speed * particle.direction,
          }}
          transition={{ 
            duration: 1,
            ease: "linear",
            type: "tween"
          }}
        />
      ))}
      
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className="absolute w-96 h-96 bg-black rounded-full shadow-lg will-change-transform"
          animate={{
            x: mousePosition.x - window.innerWidth / 2,
            y: mousePosition.y - window.innerHeight / 2,
            boxShadow: isMoving
              ? "0 0 60px 20px rgba(255,69,0,0.5)"
              : "0 0 100px 40px rgba(255,69,0,0.8)",
            scale: isMoving ? 1.02 : 1,
          }}
          transition={{ 
            duration: 0.1, // Faster sphere movement
            ease: "linear"
          }}
        />
      </div>
      
      <div className="fixed top-8 left-0 right-0 z-10 text-center">
        <h1 className="text-4xl font-bold tracking-widest text-white">
          STUDIO KÖZ
        </h1>
      </div>
      
      <div className="fixed bottom-8 left-0 right-0 z-10 text-center">
        <p className="text-gray-400">architecture + urbanism</p>
      </div>
      
      <nav className="absolute right-10 top-1/2 transform -translate-y-1/2 text-sm text-gray-400 space-y-3">
        <motion.div 
          className="cursor-pointer group relative"
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1 }}
        >
          <span className="absolute -left-4 opacity-0 group-hover:opacity-100">›</span>
          <span>work</span>
        </motion.div>
        <motion.div 
          className="cursor-pointer group relative"
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1 }}
        >
          <span className="absolute -left-4 opacity-0 group-hover:opacity-100">›</span>
          <span>about</span>
        </motion.div>
        <motion.div 
          className="cursor-pointer group relative"
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1 }}
        >
          <span className="absolute -left-4 opacity-0 group-hover:opacity-100">›</span>
          <span>manifesto</span>
        </motion.div>
        <motion.div 
          className="cursor-pointer group relative"
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1 }}
        >
          <span className="absolute -left-4 opacity-0 group-hover:opacity-100">›</span>
          <span>research</span>
        </motion.div>
      </nav>
      
      <div className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-400">
        <motion.div
          className="font-mono text-white cursor-pointer group relative mb-4"
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1 }}
        >
          <span className="absolute -left-4 opacity-0 group-hover:opacity-100">›</span>
          <span>news</span>
        </motion.div>
        <div className="max-h-24 overflow-y-auto text-xs pl-4 w-64 custom-scrollbar">
          <p className="mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p className="mb-2">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
        </div>
      </div>
    </div>
  );
}
"use client"

import { type MotionValue, useSpring, useTransform, motion } from "framer-motion"

// Spring configurations
export const springConfig = {
  stiff: {
    type: "spring",
    stiffness: 400,
    damping: 30,
  },
  gentle: {
    type: "spring",
    stiffness: 100,
    damping: 20,
  },
  bounce: {
    type: "spring",
    stiffness: 300,
    damping: 10,
    mass: 1,
  },
  slow: {
    type: "spring",
    stiffness: 50,
    damping: 15,
  },
}

// Animation variants
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: springConfig.gentle,
  },
}

export const slideUpVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: springConfig.stiff,
  },
}

export const scaleVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: springConfig.stiff,
  },
}

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
}

export const listItemVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: springConfig.stiff,
  },
}

// Custom hooks
export function useScrollTransform(scrollYProgress: MotionValue<number>, inputRange: number[], outputRange: any[]) {
  return useTransform(scrollYProgress, inputRange, outputRange)
}

export function useSmoothTransform(
  value: MotionValue<number>,
  inputRange: number[],
  outputRange: any[],
  config = { stiffness: 100, damping: 20, mass: 0.5 },
) {
  const transformedValue = useTransform(value, inputRange, outputRange)
  return useSpring(transformedValue, config)
}

// Re-export motion components for convenience
export { motion }


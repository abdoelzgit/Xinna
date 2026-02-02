"use client"

import {
  AnimatePresence,
  type HTMLMotionProps,
  motion,
  type SpringOptions,
  useMotionValue,
  useSpring,
} from "motion/react"

import * as React from "react"

import { cn } from "@/lib/utils"

interface CursorContextType {
  cursorPos: { x: number; y: number }
  isActive: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
  cursorRef: React.RefObject<HTMLDivElement | null>
}

const CursorContext = React.createContext<CursorContextType | undefined>(undefined)

const useCursor = (): CursorContextType => {
  const context = React.useContext(CursorContext)
  if (!context) {
    throw new Error("useCursor must be used within a CursorProvider")
  }
  return context
}

type CursorProviderProps = React.ComponentProps<"div"> & {
  children: React.ReactNode
}

function CursorProvider({ ref, children, ...props }: CursorProviderProps) {
  const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 })
  const mousePos = React.useRef({ x: 0, y: 0 })
  const [isActive, setIsActive] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const cursorRef = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(ref as any, () => containerRef.current as HTMLDivElement)

  React.useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const parent = containerRef.current.parentElement
    if (!parent) {
      return
    }

    if (getComputedStyle(parent).position === "static") {
      parent.style.position = "relative"
    }

    const updatePosition = (clientX: number, clientY: number) => {
      const rect = parent.getBoundingClientRect()
      setCursorPos({ x: clientX - rect.left, y: clientY - rect.top })
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      updatePosition(e.clientX, e.clientY)
      setIsActive(true)
    }

    const handleScroll = () => {
      updatePosition(mousePos.current.x, mousePos.current.y)
    }

    const handleMouseLeave = () => setIsActive(false)

    parent.addEventListener("mousemove", handleMouseMove)
    parent.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove)
      parent.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <CursorContext.Provider value={{ cursorPos, isActive, containerRef, cursorRef }}>
      <div data-slot="cursor-provider" ref={containerRef} {...(props as any)}>
        {children}
      </div>
    </CursorContext.Provider>
  )
}

type CursorProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode
}

function Cursor({ ref, children, className, style, ...props }: CursorProps) {
  const { cursorPos, isActive, containerRef, cursorRef } = useCursor()
  React.useImperativeHandle(ref as any, () => cursorRef.current as HTMLDivElement)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  React.useEffect(() => {
    const parentElement = containerRef.current?.parentElement

    if (parentElement && isActive) {
      parentElement.style.cursor = "none"
    }

    return () => {
      if (parentElement) {
        parentElement.style.cursor = "default"
      }
    }
  }, [containerRef, cursorPos, isActive])

  React.useEffect(() => {
    x.set(cursorPos.x)
    y.set(cursorPos.y)
  }, [cursorPos, x, y])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "transform-[translate(-50%,-50%)] pointer-events-none z-[9999] absolute",
            className,
          )}
          data-slot="cursor"
          exit={{ scale: 0, opacity: 0 }}
          initial={{ scale: 0, opacity: 0 }}
          ref={cursorRef}
          style={{ top: y, left: x, ...style }}
          {...(props as any)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

type Align =
  | "top"
  | "top-left"
  | "top-right"
  | "bottom"
  | "bottom-left"
  | "bottom-right"
  | "left"
  | "right"
  | "center"

type CursorFollowProps = HTMLMotionProps<"div"> & {
  sideOffset?: number
  align?: Align
  transition?: SpringOptions
  children: React.ReactNode
}

function CursorFollow({
  ref,
  sideOffset = 15,
  align = "bottom-right",
  children,
  className,
  style,
  transition = { stiffness: 500, damping: 50, bounce: 0 },
  ...props
}: CursorFollowProps) {
  const { cursorPos, isActive, cursorRef } = useCursor()
  const cursorFollowRef = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(ref as any, () => cursorFollowRef.current as HTMLDivElement)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, transition)
  const springY = useSpring(y, transition)

  const calculateOffset = React.useCallback(() => {
    const rect = cursorFollowRef.current?.getBoundingClientRect()
    const width = rect?.width ?? 0
    const height = rect?.height ?? 0

    let newOffset: { x: number; y: number }

    switch (align) {
      case "center":
        newOffset = { x: width / 2, y: height / 2 }
        break
      case "top":
        newOffset = { x: width / 2, y: height + sideOffset }
        break
      case "top-left":
        newOffset = { x: width + sideOffset, y: height + sideOffset }
        break
      case "top-right":
        newOffset = { x: -sideOffset, y: height + sideOffset }
        break
      case "bottom":
        newOffset = { x: width / 2, y: -sideOffset }
        break
      case "bottom-left":
        newOffset = { x: width + sideOffset, y: -sideOffset }
        break
      case "bottom-right":
        newOffset = { x: -sideOffset, y: -sideOffset }
        break
      case "left":
        newOffset = { x: width + sideOffset, y: height / 2 }
        break
      case "right":
        newOffset = { x: -sideOffset, y: height / 2 }
        break
      default:
        newOffset = { x: 0, y: 0 }
    }

    return newOffset
  }, [align, sideOffset])

  React.useEffect(() => {
    const offset = calculateOffset()
    const cursorRect = cursorRef.current?.getBoundingClientRect()
    const cursorWidth = cursorRect?.width ?? 20
    const cursorHeight = cursorRect?.height ?? 20

    x.set(cursorPos.x - offset.x + cursorWidth / 2)
    y.set(cursorPos.y - offset.y + cursorHeight / 2)
  }, [calculateOffset, cursorPos, cursorRef, x, y])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "transform-[translate(-50%,-50%)] pointer-events-none z-[9998] absolute",
            className,
          )}
          data-slot="cursor-follow"
          exit={{ scale: 0, opacity: 0 }}
          initial={{ scale: 0, opacity: 0 }}
          ref={cursorFollowRef}
          style={{ top: springY, left: springX, ...style }}
          {...(props as any)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export {
  CursorProvider,
  Cursor,
  CursorFollow,
  useCursor,
  type CursorContextType,
  type CursorProviderProps,
  type CursorProps,
  type CursorFollowProps,
}

// Demo
export function Demo() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative h-96 w-96 rounded-xl border bg-card">
        <CursorProvider>
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Hover over this area</p>
          </div>
          <Cursor>
            <div className="size-6 rounded-full bg-primary" />
          </Cursor>
          <CursorFollow align="bottom-right">
            <div className="rounded-full bg-primary/50 px-2 py-1 text-xs text-primary-foreground">
              Following
            </div>
          </CursorFollow>
        </CursorProvider>
      </div>
    </div>
  )
}

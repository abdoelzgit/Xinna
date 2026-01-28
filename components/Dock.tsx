'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, MotionValue, SpringOptions } from 'framer-motion';
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react';

import './Dock.css';

interface DockItemProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    mouseX: MotionValue<number>;
    spring: SpringOptions;
    distance: number;
    magnification: number;
    baseItemSize: number;
}

const DockItem = React.forwardRef<HTMLDivElement, DockItemProps>(({
    children,
    className = '',
    onClick,
    mouseX,
    spring,
    distance,
    magnification,
    baseItemSize,
    ...props
}, ref) => {
    const isHovered = useMotionValue(0);

    const mouseDistance = useTransform(mouseX, val => {
        // @ts-ignore - ref.current might be null initially
        const rect = ref?.current?.getBoundingClientRect() ?? {
            x: 0,
            width: baseItemSize
        };
        return val - rect.x - baseItemSize / 2;
    });

    const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
    const size = useSpring(targetSize, spring);

    return (
        <motion.div
            ref={ref}
            style={{
                width: size,
                height: size
            }}
            onHoverStart={() => isHovered.set(1)}
            onHoverEnd={() => isHovered.set(0)}
            onFocus={() => isHovered.set(1)}
            onBlur={() => isHovered.set(0)}
            onClick={onClick}
            className={`dock-item ${className}`}
            tabIndex={0}
            role="button"
            aria-haspopup="true"
            {...props}
        >
            {Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return cloneElement(child as React.ReactElement<any>, { isHovered });
                }
                return child;
            })}
        </motion.div>
    );
});
DockItem.displayName = "DockItem";

interface DockLabelProps {
    children: React.ReactNode;
    className?: string;
    isHovered?: MotionValue<number>;
}

function DockLabel({ children, className = '', isHovered }: DockLabelProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isHovered) return;
        const unsubscribe = isHovered.on('change', latest => {
            setIsVisible(latest === 1);
        });
        return () => unsubscribe();
    }, [isHovered]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: -10 }}
                    exit={{ opacity: 0, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`dock-label ${className}`}
                    role="tooltip"
                    style={{ left: '50%', x: '-50%', position: 'absolute', top: '-40px' }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function DockIcon({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`dock-icon ${className}`}>{children}</div>;
}

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface DockDataItem {
    icon?: React.ReactNode;
    label?: string;
    onClick?: () => void;
    className?: string;
    type?: 'item' | 'separator';
    dropdownContent?: React.ReactNode;
}

interface DockProps {
    items: DockDataItem[];
    className?: string;
    spring?: SpringOptions;
    magnification?: number;
    distance?: number;
    panelHeight?: number;
    dockHeight?: number;
    baseItemSize?: number;
}

export default function Dock({
    items,
    className = '',
    spring = { mass: 0.1, stiffness: 150, damping: 12 },
    magnification = 70,
    distance = 200,
    panelHeight = 68,
    dockHeight = 256,
    baseItemSize = 50
}: DockProps) {
    const mouseX = useMotionValue(Infinity);
    const isHovered = useMotionValue(0);

    const maxHeight = useMemo(
        () => Math.max(dockHeight, magnification + magnification / 2 + 4),
        [magnification, dockHeight]
    );
    const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
    const height = useSpring(heightRow, spring);

    return (
        <motion.div style={{ height, scrollbarWidth: 'none' }} className="dock-outer">
            <motion.div
                onMouseMove={({ pageX }) => {
                    isHovered.set(1);
                    mouseX.set(pageX);
                }}
                onMouseLeave={() => {
                    isHovered.set(0);
                    mouseX.set(Infinity);
                }}
                className={`dock-panel ${className}`}
                style={{ height: panelHeight }}
                role="toolbar"
                aria-label="Application dock"
            >
                {items.map((item, index) => {
                    if (item.type === 'separator') {
                        return (
                            <div
                                key={`sep-${index}`}
                                className="w-px h-8 bg-border mx-1 self-center opacity-70"
                            />
                        )
                    }

                    const itemProps = {
                        onClick: item.onClick,
                        className: item.className,
                        mouseX: mouseX,
                        spring: spring,
                        distance: distance,
                        magnification: magnification,
                        baseItemSize: baseItemSize,
                    }

                    const renderItem = (props: any = {}) => (
                        <DockItem {...itemProps} {...props}>
                            <DockIcon>{item.icon}</DockIcon>
                            {item.label && <DockLabel>{item.label}</DockLabel>}
                        </DockItem>
                    )

                    if (item.dropdownContent) {
                        return (
                            <DropdownMenu key={`item-${index}`}>
                                <DropdownMenuTrigger asChild>
                                    {renderItem()}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="top"
                                    align="center"
                                    sideOffset={20}
                                    className="w-56 rounded-2xl p-2 shadow-2xl border-slate-100"
                                >
                                    {item.dropdownContent}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    }

                    return <React.Fragment key={`item-${index}`}>{renderItem()}</React.Fragment>
                })}
            </motion.div>
        </motion.div>
    );
}

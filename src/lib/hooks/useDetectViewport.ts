import { useEffect } from "react";
import { useState } from "react";

const SCREEN_SIZES: Record<string, number> = {
    "xs": 375,
    "sm": 576,
    "md": 768,
    "lg": 992,
    "xl": 1200,
};

type TScreenSize = "xs" | "sm" | "md" | "lg" | "xl"

function getWidth() {
    //to avoid runtime error in server 
    if(typeof window !== "undefined" && typeof document !== "undefined") {
        return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    }

    return 0
};

export default function useDetectViewport(screenSize: TScreenSize) {
    const [currentScreenWidth, setCurrentScreenWidth] =  useState(getWidth)
    const isInRange = currentScreenWidth <= SCREEN_SIZES[screenSize] 

    useEffect(() => {
        const handleResize = () => {
            setCurrentScreenWidth(getWidth);
        };

        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    },[])

    return { isInRange, currentScreenWidth }
} 
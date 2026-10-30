"use client";

import React, { useEffect, useRef, useState } from "react";

interface CounterNumberProps {
  value: string | number;
  duration?: number;
  className?: string;
  formatWithCommas?: boolean;
}

export default function CounterNumber({
  value,
  duration = 2000,
  className = "",
  formatWithCommas = true,
}: CounterNumberProps) {
  const [displayValue, setDisplayValue] = useState<string>("0");
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const rawStr = String(value).trim();

    // Extract numerical part, prefix, suffix, and decimal precision
    const cleanedNumStr = rawStr.replace(/,/g, "");
    const match = cleanedNumStr.match(/([^\d.]*)([\d.]+)([^\d.]*)/);

    if (!match) {
      setDisplayValue(rawStr);
      return;
    }

    const prefix = match[1] || "";
    const targetNum = parseFloat(match[2]);
    const suffix = match[3] || "";
    const isDecimal = match[2].includes(".");
    const decimalPlaces = isDecimal ? match[2].split(".")[1].length : 0;

    if (isNaN(targetNum)) {
      setDisplayValue(rawStr);
      return;
    }

    const formatNum = (num: number): string => {
      if (isDecimal) {
        return num.toFixed(decimalPlaces);
      }
      if (!formatWithCommas || (targetNum >= 1950 && targetNum <= 2100 && !rawStr.includes(","))) {
        return Math.floor(num).toString();
      }
      return Math.floor(num).toLocaleString("en-US");
    };

    // Set initial 0 with proper format
    const initialFormatted = isDecimal ? (0).toFixed(decimalPlaces) : "0";
    setDisplayValue(`${prefix}${initialFormatted}${suffix}`);

    // IntersectionObserver to trigger animation on scroll into view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;

          let startTimestamp: number | null = null;

          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Ease-out cubic formula: 1 - (1 - t)^3
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = targetNum * easeProgress;

            const formattedNum = formatNum(currentVal);
            setDisplayValue(`${prefix}${formattedNum}${suffix}`);

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              // Final value
              const finalFormatted = formatNum(targetNum);
              setDisplayValue(`${prefix}${finalFormatted}${suffix}`);
            }
          };

          window.requestAnimationFrame(step);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [value, duration]);

  return (
    <span ref={elementRef} className={className}>
      {displayValue}
    </span>
  );
}

"use client";

import React, { useRef, useState, useEffect } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  enableGlint?: boolean;
}

export function GlassTiltCard({
  children,
  className = "",
  maxTilt = 8,
  enableGlint = true,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [glintPos, setGlintPos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`);

    if (enableGlint) {
      setGlintPos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.18,
      });
    }
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlintPos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={{ transform, transformStyle: "preserve-3d" }}
    >
      {children}

      {/* Dynamic Specular Light Glint Overlay */}
      {enableGlint && !isTouch && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-20"
          style={{
            opacity: glintPos.opacity,
            background: `radial-gradient(circle 280px at ${glintPos.x}% ${glintPos.y}%, rgba(255,255,255,0.4) 0%, rgba(204,167,39,0.15) 40%, transparent 80%)`,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </div>
  );
}

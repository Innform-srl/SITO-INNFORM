import React, { useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface InfiniteCarouselProps {
  images: string[];
  speed?: number;
  direction?: 'left' | 'right';
  altPrefix?: string;
}

export function InfiniteCarousel({ images, speed = 30, direction = 'left', altPrefix = "Sessione di formazione Innform" }: InfiniteCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = direction === 'left' ? speed : -speed;

    const scroll = () => {
      scrollPosition += scrollSpeed / 60; // 60 FPS
      
      if (direction === 'left') {
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
      } else {
        if (scrollPosition <= -scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
      }
      
      scrollContainer.style.transform = `translateX(${-scrollPosition}px)`;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [speed, direction]);

  // Duplicate images for infinite effect
  const duplicatedImages = [...images, ...images];

  return (
    <div className="overflow-hidden w-full">
      <div
        ref={scrollRef}
        className="flex gap-6"
        style={{ width: 'max-content' }}
      >
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-80 h-56 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <ImageWithFallback
              src={image}
              alt={`${altPrefix} - Foto ${(index % images.length) + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

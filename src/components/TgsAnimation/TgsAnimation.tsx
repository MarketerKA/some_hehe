import { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import pako from 'pako';
import './TgsAnimation.scss';

interface TgsAnimationProps {
  src: string;
  className?: string;
}

const TgsAnimation = ({ src, className = '' }: TgsAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    fetch(src)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        // Распаковываем gzip
        const decompressed = pako.inflate(new Uint8Array(buffer), { to: 'string' });
        const animationData = JSON.parse(decompressed);
        
        if (containerRef.current) {
          animationRef.current = lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animationData,
          });
        }
      })
      .catch(error => {
        console.error('Error loading TGS animation:', error);
      });

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [src]);

  return <div ref={containerRef} className={`tgs-animation ${className}`} />;
};

export default TgsAnimation;

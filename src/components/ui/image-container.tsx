import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

export const ImageContainer: React.FC<ImageContainerProps> = ({
  src,
  alt,
  className,
  width = 500,
  height = 300,
  priority = false,
  sizes,
  style,
  ...props
}) => {
  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)} style={style} {...props}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        priority={priority}
        sizes={sizes}
      />
    </div>
  );
};

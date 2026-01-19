import Image from 'next/image';

interface LoadingIndicatorProps {
  size?: number;
  className?: string;
}

export default function LoadingIndicator({ size = 100, className = '' }: LoadingIndicatorProps) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Image
        src="/running-stick-figure-jointed.svg"
        alt="Loading..."
        width={size}
        height={size}
        priority
      />
    </div>
  );
}

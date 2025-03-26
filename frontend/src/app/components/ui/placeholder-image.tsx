import Image from "next/image"

interface PlaceholderImageProps {
  width: number
  height: number
  className?: string
}

export function PlaceholderImage({ width, height, className }: PlaceholderImageProps) {
  return (
    <Image
      src={`/placeholder.svg?width=${width}&height=${height}`}
      width={width}
      height={height}
      alt="Placeholder"
      className={className}
    />
  )
}


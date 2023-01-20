import { useRef, useState } from "react";

interface Coord {
  x: number;
  y: number;
}

const useMouseOffset = () => {
  const [mouseCoord, setMouseCoord] = useState<Coord>({ x: 0, y: 0 });
  const prevCoord = useRef<Coord | null>(null);

  return {
    calcMouseOffset: (coord: Coord) => setMouseCoord(coord),
    initMouseCoord: (coord: Coord) => {
      prevCoord.current = coord;
    },
    offset: {
      x: mouseCoord.x - (prevCoord?.current?.x ?? mouseCoord.x),
      y: mouseCoord.y - (prevCoord?.current?.y ?? mouseCoord.y),
    },
  };
};

export default useMouseOffset;

import { Position } from "@/types";

const CELL_ID_PREFIX = "--table";
const ALPHABETS = [..."ABCDEFGHIZKLMNOPQRSTUVWXYZ"];

const getCellId = ({ row, col }: Position) => `${CELL_ID_PREFIX}-${row}-${col}`;

const getColumnAlpha = (colNumber: number) => {
  if (colNumber === 0) return ALPHABETS[0];

  const arr = [];
  let num = colNumber;

  while (num) {
    arr.push(ALPHABETS[num % 26]);
    num /= 26;
  }
  return arr.reverse().join("");
};

const isBoundingBorder = ({
  x,
  y,
  boundingRect,
}: {
  x: number;
  y: number;
  boundingRect: DOMRect;
}) => ({
  left: x - boundingRect.left < 5 && x - boundingRect.left >= 0,
  right: boundingRect.right - x < 5 && boundingRect.right - x > 0,
  top: y - boundingRect.top < 5 && y - boundingRect.top >= 0,
  bottom: boundingRect.bottom - y < 5 && boundingRect.bottom - y > 0,
});

export { CELL_ID_PREFIX, getCellId, getColumnAlpha, isBoundingBorder };

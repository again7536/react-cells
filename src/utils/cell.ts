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

export { CELL_ID_PREFIX, getCellId, getColumnAlpha };

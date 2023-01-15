import { Position } from "@/types";

const CELL_ID_PREFIX = "--table";

const getCellId = ({ row, col }: Position) => `${CELL_ID_PREFIX}-${row}-${col}`;

export { CELL_ID_PREFIX, getCellId };

interface Position {
  row: number;
  col: number;
}

interface Area {
  start: Position;
  end: Position;
}

interface CellInfo {
  data: unknown;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, position: Position) => void;
}

export type { Position, Area, CellInfo };

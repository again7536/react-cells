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
}

type Cursor = "cell" | "ew-resize" | "ns-resize";

type MouseState =
  | "normal"
  | "select"
  | "resize-left"
  | "resize-bottom"
  | "resize-right"
  | "resize-top";

export type { Position, Area, CellInfo, Cursor, MouseState };

import { Position, Area } from "@/types";

const getPosition = (id: string) => ({ row: +id.split("-")[3], col: +id.split("-")[4] });

const changeAreaValid = (area: Area, pivot: Position, pos: Position): Area => {
  const start = { ...area.start };
  const end = { ...area.end };

  if (pos.col <= pivot.col) {
    end.col = pivot.col;
    start.col = pos.col;
  } else {
    start.col = pivot.col;
    end.col = pos.col;
  }

  if (pos.row <= pivot.row) {
    end.row = pivot.row;
    start.row = pos.row;
  } else {
    end.row = pivot.row;
    end.row = pos.row;
  }

  return {
    start,
    end,
  };
};

const isSelected = (position: Position, area: Area) =>
  area.start.col <= position.col &&
  area.end.col >= position.col &&
  area.start.row <= position.row &&
  area.end.row >= position.row;

const BASE_POSITION = Object.freeze({ row: 0, col: 0 });

export { BASE_POSITION, getPosition, changeAreaValid, isSelected };

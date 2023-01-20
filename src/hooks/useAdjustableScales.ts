import {
  DEFAULT_COL_COUNT,
  DEFAULT_COL_SIZE,
  DEFAULT_ROW_COUNT,
  DEFAULT_ROW_SIZE,
} from "@/constants";
import { MouseState, Position } from "@/types";
import { useRef, useState } from "react";

interface UseAdjustableScalesParams {
  initialColumns?: number[];
  initialRows?: number[];
}

const useAdjustableScales = ({ initialColumns, initialRows }: UseAdjustableScalesParams) => {
  // current width : width + offset
  const [columnsWidth, setColumnsWidth] = useState<number[]>(
    initialColumns ?? Array.from({ length: DEFAULT_COL_COUNT }, () => DEFAULT_COL_SIZE)
  );
  const [rowsHeight, setRowsHeight] = useState<number[]>(
    initialRows ?? Array.from({ length: DEFAULT_ROW_COUNT }, () => DEFAULT_ROW_SIZE)
  );
  const prevColumnsWidth = useRef<number[]>(
    Array.from({ length: DEFAULT_COL_COUNT }, () => DEFAULT_COL_SIZE)
  );
  const prevRowsHeight = useRef<number[]>(
    Array.from({ length: DEFAULT_ROW_COUNT }, () => DEFAULT_ROW_SIZE)
  );

  const commit = () => {
    prevColumnsWidth.current = columnsWidth;
    prevRowsHeight.current = rowsHeight;
  };

  const setColumnsWidthUncommited = (setterOrValue: ((prev: number[]) => number[]) | number[]) => {
    let result: number[] = [];
    if (typeof setterOrValue === "function") result = setterOrValue(prevColumnsWidth.current ?? []);
    else result = setterOrValue;

    setColumnsWidth(result);
  };

  const setRowsHeightUncommited = (setterOrValue: ((prev: number[]) => number[]) | number[]) => {
    let result: number[] = [];
    if (typeof setterOrValue === "function") result = setterOrValue(prevRowsHeight.current ?? []);
    else result = setterOrValue;

    setRowsHeight(result);
  };

  // should be modified (width negative values)
  const resizeUncommited = (
    mouseState: MouseState,
    pivot: Position,
    offset: { x: number; y: number },
    colCount: number,
    rowCount: number
  ) => {
    if (mouseState === "resize-left" && pivot.col > 0)
      setColumnsWidthUncommited((prev) => {
        const next = [...prev];
        if (next[pivot.col] - offset.x <= 0 || next[pivot.col - 1] + offset.x <= 0) return next;

        next[pivot.col] -= offset.x;
        next[pivot.col - 1] += offset.x;
        return next;
      });
    if (mouseState === "resize-right" && pivot.col < colCount)
      setColumnsWidthUncommited((prev) => {
        const next = [...prev];
        if (next[pivot.col] + offset.x <= 0 || next[pivot.col + 1] + offset.x <= 0) return next;

        next[pivot.col] += offset.x;
        next[pivot.col + 1] -= offset.x;
        return next;
      });
    if (mouseState === "resize-top" && pivot.row > 0)
      setRowsHeightUncommited((prev) => {
        const next = [...prev];
        if (next[pivot.row] - offset.y <= 0 || next[pivot.row - 1] + offset.y <= 0) return next;

        next[pivot.row] -= offset.y;
        next[pivot.row - 1] += offset.y;
        return next;
      });
    if (mouseState === "resize-bottom" && pivot.row < rowCount)
      setRowsHeightUncommited((prev) => {
        const next = [...prev];
        if (next[pivot.row] + offset.y <= 0 || next[pivot.row + 1] + offset.y <= 0) return next;

        next[pivot.row] += offset.y;
        next[pivot.row + 1] -= offset.y;
        return next;
      });
  };

  return {
    columnsWidth,
    rowsHeight,
    setColumnsWidthUncommited,
    setRowsHeightUncommited,
    setColumnsWidth,
    setRowsHeight,
    resizeUncommited,
    commit,
  };
};

export default useAdjustableScales;

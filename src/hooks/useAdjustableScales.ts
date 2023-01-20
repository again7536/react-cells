import {
  DEFAULT_COL_COUNT,
  DEFAULT_COL_SIZE,
  DEFAULT_ROW_COUNT,
  DEFAULT_ROW_SIZE,
} from "@/constants";
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

  return {
    columnsWidth,
    rowsHeight,
    setColumnsWidthUncommited: (setterOrValue: ((prev: number[]) => number[]) | number[]) => {
      let result: number[] = [];
      if (typeof setterOrValue === "function")
        result = setterOrValue(prevColumnsWidth.current ?? []);
      else result = setterOrValue;

      setColumnsWidth(result);
    },
    setRowsHeightUncommited: (setterOrValue: ((prev: number[]) => number[]) | number[]) => {
      let result: number[] = [];
      if (typeof setterOrValue === "function") result = setterOrValue(prevRowsHeight.current ?? []);
      else result = setterOrValue;

      setRowsHeight(result);
    },
    setColumnsWidth,
    setRowsHeight,
    commit,
  };
};

export default useAdjustableScales;

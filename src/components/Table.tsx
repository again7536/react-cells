/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { HTMLProps, ReactNode, useState } from "react";
import { Cell } from "@/components/Cell";
import { BASE_POSITION, changeAreaValid, getPosition, isSelected } from "@/utils/position";
import { Area, CellInfo, Position } from "@/types";
import { CELL_ID_PREFIX } from "@/utils/cell";

interface TableProps extends Omit<HTMLProps<HTMLTableElement>, "rows"> {
  rowCount?: number;
  colCount?: number;
  onChangeCell?: (e: React.ChangeEvent<HTMLInputElement>, position: Position) => void;
  rows?: { onChange?: (e: React.ChangeEvent<HTMLInputElement>, position: Position) => void }[];
  columns?: { onChange?: (e: React.ChangeEvent<HTMLInputElement>, position: Position) => void }[];
  cells: CellInfo[][];
}

const DEFAULT_ROW_COUNT = 3;
const DEFAULT_COL_COUNT = 5;

function Table({
  rowCount = DEFAULT_ROW_COUNT,
  colCount = DEFAULT_COL_COUNT,
  onChangeCell,
  rows,
  columns,
  cells,
  ...props
}: TableProps) {
  const [mouseState, setMouseState] = useState<boolean>(false);
  const [pivot, setPivot] = useState<Position>(BASE_POSITION);
  const [selected, setSelected] = useState<Area>({
    start: BASE_POSITION,
    end: BASE_POSITION,
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLTableElement>) => {
    const elem = e.target as HTMLElement;
    if (!elem.id.startsWith(CELL_ID_PREFIX)) return;

    e.stopPropagation();
    const position = getPosition(elem.id);
    setSelected({ start: position, end: position });
    setPivot(position);
    setMouseState(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLTableElement>) => {
    if (!mouseState) return;
    const position = getPosition((e.target as HTMLElement).id);
    if (!Number.isInteger(position.col)) return;

    setSelected((prev) => changeAreaValid(prev, pivot, position));
  };

  const handleMouseUp = () => setMouseState(false);

  return (
    <table
      {...props}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <thead>
        <tr>
          {Array.from({ length: colCount }).map(() => (
            <th> </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rowCount }).map((_, row) => (
          <tr>
            {Array.from({ length: colCount }).map((__, col) => (
              <Cell
                onChange={
                  onChangeCell ??
                  columns?.[col]?.onChange ??
                  rows?.[row]?.onChange ??
                  cells[row]?.[col]?.onChange
                }
                row={row}
                col={col}
                selected={isSelected({ row, col }, selected)}
              >
                {(cells[row]?.[col]?.data ?? "") as ReactNode}
              </Cell>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export { Table };

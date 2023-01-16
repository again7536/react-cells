/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { HTMLProps, ReactNode, useState } from "react";
import { Cell } from "@/components/Cell";
import { BASE_POSITION, changeAreaValid, getPosition, isSelected } from "@/utils/position";
import { Area, CellInfo, Position } from "@/types";
import { CELL_ID_PREFIX, getColumnAlpha } from "@/utils/cell";
import { styled } from "goober";

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

const TableElement = styled("table")`
  border-collapse: collapse;
  border-spacing: 0;

  tr {
    border-top: 1px solid #3c3c3c20;

    &:last-child {
      border-bottom: 1px solid #3c3c3c20;
    }
  }

  td,
  th {
    border-left: 1px solid #3c3c3c20;

    &:last-child {
      border-right: 1px solid #3c3c3c20;
    }
  }
`;

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

  /**
   * check that the mouse is on the border
   * if then,
   *  - change mouse cursor when border
   *  - make cell resizable
   *  - if the cell is header, show column/row add ui
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLTableElement>) => {
    if (!mouseState) return;
    const position = getPosition((e.target as HTMLElement).id);
    if (!Number.isInteger(position.col)) return;

    setSelected((prev) => changeAreaValid(prev, pivot, position));
  };

  const handleMouseUp = () => setMouseState(false);

  return (
    <TableElement
      {...props}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <thead>
        <tr>
          <th> </th>
          {
            // Display Column number with alphabet
            Array.from({ length: colCount }).map((_, col) => (
              <th>{getColumnAlpha(col)}</th>
            ))
          }
        </tr>
      </thead>

      <tbody>
        {Array.from({ length: rowCount }).map((_, row) => (
          <tr>
            <td>{row + 1}</td>

            {
              // Draw cells
              Array.from({ length: colCount }).map((__, col) => (
                <Cell
                  onChange={
                    cells[row]?.[col]?.onChange ??
                    rows?.[row]?.onChange ??
                    columns?.[col]?.onChange ??
                    onChangeCell
                  }
                  row={row}
                  col={col}
                  selected={isSelected({ row, col }, selected)}
                >
                  {(cells[row]?.[col]?.data ?? "") as ReactNode}
                </Cell>
              ))
            }
          </tr>
        ))}
      </tbody>
    </TableElement>
  );
}

export { Table };

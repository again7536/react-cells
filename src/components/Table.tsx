/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { HTMLProps, ReactNode, useState } from "react";
import { styled } from "goober";
import { Cell } from "@/components/Cell";
import { BASE_POSITION, changeArea, getPosition, isSelected } from "@/utils/position";
import { Area, CellInfo, Cursor, MouseState, Position } from "@/types";
import { CELL_ID_PREFIX, getColumnAlpha, getCursor, getMouseState } from "@/utils/cell";
import useMouseOffset from "@/hooks/useMouseOffset";
import useAdjustableScales from "@/hooks/useAdjustableScales";
import { DEFAULT_COL_COUNT, DEFAULT_ROW_COUNT } from "@/constants";

interface TableProps extends Omit<HTMLProps<HTMLTableElement>, "rows"> {
  rowCount?: number;
  colCount?: number;
  onChangeCell?: (e: React.ChangeEvent<HTMLInputElement>, position: Position) => void;
  rows?: {
    initialHeight?: number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>, position: Position) => void;
  }[];
  columns?: {
    initialWidth?: number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>, position: Position) => void;
  }[];
  cells: CellInfo[][];
}

const TableElement = styled("table")<{ cursor: Cursor }>`
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  cursor: ${({ cursor }) => cursor};

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
  const [cursor, setCursor] = useState<Cursor>("ew-resize");
  const [mouseState, setMouseState] = useState<MouseState>("normal");
  const [pivot, setPivot] = useState<Position>(BASE_POSITION);
  const [selected, setSelected] = useState<Area>({
    start: BASE_POSITION,
    end: BASE_POSITION,
  });

  const { initMouseCoord, calcMouseOffset, offset } = useMouseOffset();
  const { columnsWidth, rowsHeight, resizeUncommited, commit } = useAdjustableScales({
    initialColumns: columns?.map((c) => c.initialWidth ?? 100),
    initialRows: rows?.map((r) => r.initialHeight ?? 100),
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLTableElement>) => {
    const elem = e.target as HTMLElement;
    if (!elem.id.startsWith(CELL_ID_PREFIX)) return;
    e.stopPropagation();

    const position = getPosition(elem.id);
    const boundingRect = elem.getBoundingClientRect();

    setSelected({ start: position, end: position });
    setPivot(position);

    initMouseCoord({ x: e.clientX, y: e.clientY });
    setMouseState(getMouseState({ x: e.clientX, y: e.clientY, boundingRect }));
    setCursor(
      getCursor({
        x: e.clientX,
        y: e.clientY,
        boundingRect,
      })
    );
  };

  /**
   * check that the mouse is on the border
   * if then,
   *  - change mouse cursor when border
   *  - make cell resizable
   *  - if the cell is header, show column/row add ui
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLTableElement>) => {
    e.preventDefault();

    const elem = e.target as HTMLElement;
    const position = getPosition(elem.id);
    if (!Number.isInteger(position.col)) return;

    // set cursor
    if (mouseState === "normal")
      setCursor(
        getCursor({
          x: e.clientX,
          y: e.clientY,
          boundingRect: elem.getBoundingClientRect(),
        })
      );

    // resize
    calcMouseOffset({ x: e.clientX, y: e.clientY });
    if (mouseState === "select") setSelected((prev) => changeArea(prev, pivot, position));
    resizeUncommited(mouseState, pivot, offset, colCount, rowCount);
  };

  const handleMouseUp = () => {
    setMouseState("normal");
    commit();
  };

  return (
    <TableElement
      {...props}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      cursor={cursor}
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
          <tr style={{ height: `${rowsHeight[row]}px` }}>
            <td>{row + 1}</td>

            {
              // Draw cells
              Array.from({ length: colCount }).map((__, col) => (
                <Cell
                  onChange={rows?.[row]?.onChange ?? columns?.[col]?.onChange ?? onChangeCell}
                  row={row}
                  col={col}
                  cellWidth={columnsWidth[col]}
                  cellHeight={rowsHeight[row]}
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

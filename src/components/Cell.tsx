import { HTMLProps, ReactNode, useState } from "react";
import { styled } from "goober";
import { getCellId } from "@/utils/cell";
import { Position } from "@/types";
import { DEFAULT_COL_SIZE, DEFAULT_ROW_SIZE } from "@/constants";

interface CellProps extends Omit<HTMLProps<HTMLTableCellElement>, "onChange" | "width"> {
  children: ReactNode;
  row: number;
  col: number;
  cellWidth: number;
  cellHeight: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, position: Position) => void;
  selected?: boolean;
}

type CellState = "input" | "cell";

const CellInput = styled("input")`
  max-width: calc(100% - 4px);
  max-heigth: calc(100% - 2px):
  width: calc(100% - 4px);
  height: calc(100% - 2px);

  border: none;
  outline: none;
  margin: 1px 0;
`;
const CellElement = styled("td")<{ cellWidth?: number; cellHeight?: number; selected?: boolean }>`
  min-width: ${({ cellWidth }) => cellWidth ?? DEFAULT_COL_SIZE}px;
  max-width: ${({ cellWidth }) => cellWidth ?? DEFAULT_COL_SIZE}px;
  min-height: ${({ cellHeight }) => cellHeight ?? DEFAULT_ROW_SIZE}px;
  max-height: ${({ cellHeight }) => cellHeight ?? DEFAULT_ROW_SIZE}px;
  background: ${(props) => (props.selected ? "#5b93fa7f" : "inherit")};
  padding: 0;
`;

function Cell({ children, row, col, selected, onChange, ...props }: CellProps) {
  const [state, setState] = useState<CellState>("cell");
  const handleDoubleClick = () => {
    setState((prev) => (prev === "cell" ? "input" : "cell"));
  };

  return (
    <CellElement
      {...props}
      onDoubleClick={handleDoubleClick}
      id={getCellId({ row, col })}
      selected={selected}
    >
      {state === "cell" ? (
        children
      ) : (
        <CellInput
          autoFocus
          onChange={(e) => onChange && onChange(e, { row, col })}
          onBlur={() => setState("cell")}
        />
      )}
    </CellElement>
  );
}

export { Cell };

import { HTMLProps, ReactNode, useState } from "react";
import { getCellId } from "@/utils/cell";
import { Position } from "@/types";
import { styled } from "goober";

interface CellProps extends Omit<HTMLProps<HTMLTableCellElement>, "onChange"> {
  children: ReactNode;
  row: number;
  col: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, position: Position) => void;
  selected?: boolean;
}

type CellState = "input" | "cell";

const CellInput = styled("input")`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
`;
const CellElement = styled("td")<{ selected?: boolean }>`
  width: 100px;
  height: 30px;
  background: ${(props) => (props.selected ? "#5b93fa7f" : undefined)};
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

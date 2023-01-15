import { HTMLProps, ReactNode } from "react";

interface RowProps extends HTMLProps<HTMLTableRowElement> {
  children: ReactNode;
}

function Row({ children, ...props }: RowProps) {
  return <tr {...props}>{children}</tr>;
}

export { Row };

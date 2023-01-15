import React, { useState } from "react";
import { Table } from "@/components/Table";
import "./app.css";
import { CellInfo, Position } from "./types";

export function App() {
  const [cells, setCells] = useState<CellInfo[][]>([[]]);

  const handleChangeCell = (e: React.ChangeEvent<HTMLInputElement>, { col, row }: Position) => {
    setCells((prev) => {
      const next = [...prev];
      if (!next[row]) next[row] = [];
      next[row][col] = { ...next[row][col], data: e.target.value };
      return next;
    });
  };

  return <Table cells={cells} onChangeCell={handleChangeCell} />;
}

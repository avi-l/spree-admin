"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

export type TCategoryColumn = {
  id: string;
  name: string;
  billboardLabel: string;
};

export const columns: ColumnDef<TCategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => row.original.billboardLabel,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

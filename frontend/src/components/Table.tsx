import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ButtonEdit } from "./buttons/ButtonEdit";
import { ButtonShare } from "./buttons/ButtonShare";
import { ButtonCopy } from "./buttons/ButtonCopy";
import { ButtonDelete } from "./buttons/ButtonDelete";

interface Column<T> {
  header: string;
  accessor: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: Array<T & { _id: string}>;
  onEdit?: (item: any) => void;
  onCopy?: (item: any) => void;
  onShare?: (item: any) => void;
  onDelete?: (item: any) => void;
}

export const Table = <T,>({
  columns,
  data,
  onEdit,
  onCopy,
  onShare,
  onDelete,
}: TableProps<T>) => {
  return (
    <UITable>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.header}>{column.header}</TableHead>
          ))}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item._id}>
            {columns.map((column) => (
              <TableCell className="whitespace-nowrap" key={column.header}>
                {column.cell
                  ? column.cell(item)
                  : String(item[column.accessor])}
              </TableCell>
            ))}
            <TableCell>
              <div className="flex justify-end gap-2">
                {onEdit && (
                  <ButtonEdit handleClick={() => onEdit(item)} />
                )}
                {onCopy && (
                  <ButtonCopy handleClick={() => onCopy(item)} />
                )}
                {onShare && (
                  <ButtonShare handleClick={() => onShare(item)} />
                )}
                {onDelete && (
                  <ButtonDelete handleClick={() => onDelete(item)} />
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </UITable>
  );
};

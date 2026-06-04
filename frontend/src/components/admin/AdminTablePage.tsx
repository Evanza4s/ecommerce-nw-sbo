"use client";

import { ReactNode, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminMetricCards from "@/components/admin/AdminMetricCards";
import AdminPanelCard from "@/components/admin/AdminPanelCard";
import AdminPageSection from "@/components/ui/AdminPageSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FilterOption {
  label: string;
  value: string;
}

interface TableFilter<T> {
  label: string;
  value: string;
  options: FilterOption[];
  getValue: (item: T) => string;
}

interface TableColumn<T> {
  header: string;
  className?: string;
  cell: (item: T) => ReactNode;
}

interface AdminTablePageProps<T> {
  title: string;
  description: string;
  breadcrumbs: { label: string; href?: string }[];
  data: T[];
  getRowKey: (item: T) => string;
  columns: TableColumn<T>[];
  searchPlaceholder: string;
  searchBy: (item: T) => string;
  filters?: TableFilter<T>[];
  metrics?: { label: string; value: string; description: string }[];
  action?: { label: string; href: string };
  emptyMessage: string;
}

const ITEMS_PER_PAGE = 6;

function AdminTablePage<T>({
  title,
  description,
  breadcrumbs,
  data,
  getRowKey,
  columns,
  searchPlaceholder,
  searchBy,
  filters = [],
  metrics = [],
  action,
  emptyMessage,
}: AdminTablePageProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    Object.fromEntries(filters.map((filter) => [filter.value, "all"]))
  );
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = searchBy(item)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilters = filters.every((filter) => {
        const selectedValue = activeFilters[filter.value] ?? "all";
        return (
          selectedValue === "all" || filter.getValue(item) === selectedValue
        );
      });

      return matchesSearch && matchesFilters;
    });
  }, [activeFilters, data, filters, searchBy, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedData = filteredData.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (filterKey: string, nextValue: string) => {
    setActiveFilters((current) => ({ ...current, [filterKey]: nextValue }));
    setCurrentPage(1);
  };

  return (
    <AdminPageSection title={title} description={description}>
      <AdminBreadcrumbs items={breadcrumbs} />
      {metrics.length > 0 ? <AdminMetricCards items={metrics} /> : null}

      <AdminPanelCard interactive>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="pl-9"
              />
            </div>

            {filters.map((filter) => (
              <select
                key={filter.value}
                value={activeFilters[filter.value] ?? "all"}
                onChange={(event) =>
                  handleFilterChange(filter.value, event.target.value)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm md:max-w-52"
              >
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
          </div>

          {action ? (
            <Button asChild className="w-full lg:w-auto">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.header} className={column.className}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow key={getRowKey(item)}>
                    {columns.map((column) => (
                      <TableCell key={column.header} className={column.className}>
                        {column.cell(item)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing {paginatedData.length} of {filteredData.length} records
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safePage === 1}
            >
              Previous
            </Button>
            <span>
              Page {safePage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={safePage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </AdminPanelCard>
    </AdminPageSection>
  );
}

export default AdminTablePage;

"use client";

import FullPageCard from "@/components/FullPageCard";
import { Table } from "@/components/Table";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TableFilters } from "@/components/TableFilters";
import { Pagination } from "./Pagination";
import { useSearchParams } from "next/navigation";
import SingleTableSkeleton from "./skeletons/SingleTableSkeleton";

interface ReusableTableCardProps<T> {
  title: string;
  description: string;
  columns: any[];
  service: {
    getItems: (params: any) => Promise<{ items: T[]; totalPages: number }>;
    deleteItem?: (id: string) => Promise<void>;
  };
  orderOptions: { value: string; label: string }[];
}

const ReusableTableCard = <T extends { id: string }>({
  title,
  description,
  columns,
  service,
  orderOptions,
}: ReusableTableCardProps<T>) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || orderOptions[0].value;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = 5;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [title.toLowerCase(), search, sort, currentPage],
    queryFn: async () => {
      const { items, totalPages } = await service.getItems({
        search,
        sort,
        page: currentPage,
        itemsPerPage,
      });
      console.log(items, totalPages);
      return { items, totalPages };
    },
  });

  const deleteItemMutation = useMutation<void, Error, T>({
    mutationFn: async (item: T) => {
      if (service.deleteItem) {
        await service.deleteItem(item.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [title.toLowerCase()] });
      toast({
        title: `${title} deleted.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: `Error deleting ${title.toLowerCase()}.`,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEditButton = (item: T) => {
    router.push(`/${title.toLowerCase()}/${item.id}/edit`);
  };

  const handleCopyButton = (item: T) => {
    navigator.clipboard.writeText(JSON.stringify(item));
    toast({
      title: `${item} was copied to the clipboard.`,
    });
  };

  const handleShareButton = (item: T) => {
    console.log(`Share action on ${title.toLowerCase()}:`, item);
  };

  const handleDeleteButton = (item: T) => {
    deleteItemMutation.mutate(item);
  };

  const updateSearchParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(window.location.search);

    if (newParams.get(key) === value) {
      return;
    }

    if (key === "search") {
      newParams.set("page", "1");
    }

    newParams.set(key, value);
    router.push(`?${newParams.toString()}`);
  };

  const tableSkeletonRows = Array.from({ length: itemsPerPage + 1 }).map(
    (_, index) => <SingleTableSkeleton key={index} />
  );

  return (
    <FullPageCard
      title={title}
      description={description}
      customComponent={
        <div className="flex items-center gap-2">
          <TableFilters
            orderOptions={orderOptions}
            search={search}
            sort={sort}
            onSearchChange={(newSearch) =>
              updateSearchParams("search", newSearch)
            }
            onSortChange={(newSort) => updateSearchParams("sort", newSort)}
          />
        </div>
      }
    >

      {isLoading ? (
        tableSkeletonRows
      ) : (
        <>
          <Table
            columns={columns}
            data={data?.items || []}
            onEdit={handleEditButton}
            onCopy={handleCopyButton}
            onShare={handleShareButton}
            onDelete={handleDeleteButton}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={data?.totalPages || 1}
            onPageChange={(newPage) => updateSearchParams("page", newPage.toString())}
          />
        </>
      )}
    </FullPageCard>
  );
};

export default ReusableTableCard;

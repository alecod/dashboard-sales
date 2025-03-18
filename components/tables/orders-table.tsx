"use client";
import { getShopifyOrdersDataFetch } from "@/actions/shopify/get-shopify-orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStoreHook } from "@/hooks/store-hook";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Select } from "@radix-ui/react-select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DatePicker } from "../ui/datepicker2";
import { Label } from "../ui/label";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export type Order = {
  id: number;
  store_cod: number;
  type: string;
  cod: string;
  financial_status: string;
  note: string;
  items: Array<{
    id: number;
    store_cod: number;
    title: string;
    variants: Array<{
      id: number;
      title: string;
      price: string;
      sku: string;
      position: number;
      quantity: number;
      taxable: boolean;
      cost: string | null;
      barcode: string | null;
      images: Array<{
        id: number;
        src: string;
        position: number;
      }>;
    }>;
    tags: string[];
    images: Array<{
      id: number;
      src: string;
      position: number;
    }>;
    image: {
      id: number;
      src: string;
      position: number;
    };
  }>;
  currency: string;
  total: string;
  subtotal: string;
  total_tax_added: string;
  total_discounts: string;
  tags: string[];
  customer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    tags: string[];
    marketing_consent: boolean;
    cpf: string | null;
  };
  created_at: string;
  info: {
    sub_cost: {
      profit_percentage: string;
      profit: string;
    };
    sub_fees: {
      profit_percentage: string;
      profit: string;
    };
    sub_all: {
      profit_percentage: string;
      profit: string;
    };
    total_fee: string;
    items_ranking: Array<{
      product_id: number;
      variant_id: number;
      product_title: string;
      variant_title: string;
      profit: string;
      profit_percentage: string;
    }>;
    processed_at: string;
  };
};

const ActionsMenu = ({ item }: { item: Order | null }) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(String(item?.id))}
        >
          Copiar ID do pedido
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            if (item?.id) {
              router.push(`/orders/${item?.id}`);
            } else {
              alert("ID do pedido não encontrado.");
            }
          }}
        >
          Ver detalhes do pedido
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export function OrdersTable() {
  const { selectedStore } = useStoreHook();
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [limit] = useState(20);
  const [filter, setFilter] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 6)),
    end: new Date(),
    status: "any",
  });

  const handleDateChange = (range: { start: Date; end: Date }) => {
    setFilter((prev) => ({ ...prev, start: range.start, end: range.end }));
  };

  // Função para mudar o status
  const handleStatusChange = (status: string) => {
    setFilter((prev) => ({ ...prev, status }));
  };
  const queryClient = useQueryClient();

  const {
    data: shopifyOrdersnData,
    isPending,
    isError,
  } = useQuery({
    enabled: !!selectedStore,
    queryKey: ["shopifyOrdersnData", selectedStore, limit, pageIndex, filter],
    queryFn: async (): Promise<{ data: Order[]; total?: number }> => {
      const res = await getShopifyOrdersDataFetch({
        endDate: filter.end.toISOString(),
        startDate: filter.start.toISOString(),
        status: filter.status,
        store_cod: selectedStore?.store_cod as number,
        limit,
        pageIndex,
      });

      if (res?.serverError) {
        throw new Error("Error");
      }
      return res?.data;
    },
    staleTime(query) {
      if (query.state.dataUpdateCount === 0) {
        return 0;
      }
      return Number.POSITIVE_INFINITY;
    },
    retry: 0,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isError) {
      queryClient.setQueryDefaults(
        ["shopifyOrdersnData", selectedStore, limit, pageIndex, filter],
        { staleTime: Number.POSITIVE_INFINITY }
      );
    }
  }, [isError]);

  return (
    <div className="mt-5 w-full">
      <div className="mb-4 flex w-full items-center  justify-start lg:justify-end gap-5">
        <div className="pt-7">
          <DatePicker
            start={filter.start}
            end={filter.end}
            onDateChange={handleDateChange}
          />
        </div>

        <div>
          <Label>Selecione:</Label>
          <Select onValueChange={handleStatusChange} defaultValue="any">
            <SelectTrigger className="w-full">
              <SelectValue placeholder={filter.status} />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="any">Todos</SelectItem>
              <SelectItem value="paid">Pago</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="voided">Cancelado</SelectItem>
              <SelectItem value="refunded">Reembolsado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table className="bg-kirofy-greenDark">
          <TableHeader>
            <TableRow>
              <TableHead>ID do Pedido</TableHead>
              <TableHead>Status do Pedido</TableHead>
              <TableHead>Nome do Produto</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Nome do Cliente</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Data do Pedido</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-kirofy-white dark:bg-kirofy-greenDark">
            {isPending ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={Number(index)}>
                  {[...Array(9)].map((_, colIndex) => (
                    <TableCell key={Number(colIndex)}>
                      <Skeleton className="h-6" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : shopifyOrdersnData?.data.length ? (
              shopifyOrdersnData.data.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        order.financial_status === "paid"
                          ? "text-white bg-[#70c08b]"
                          : "bg-red-500 text-white"
                      }
                    >
                      {order.financial_status === "paid" ? "Pago" : "Não pago"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.items.map((item) => (
                      <div key={item.id}>
                        {item.title} -{" "}
                        {item.variants.map((v) => v.title).join(", ")}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>{`${order.customer.first_name} ${order.customer.last_name}`}</TableCell>
                  <TableCell>{order.customer.email}</TableCell>
                  <TableCell>{order.customer.phone}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <ActionsMenu item={order} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPageIndex((old) => Math.max(old - 1, 0));
            }}
            disabled={pageIndex === 0}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPageIndex((old) => old + 1);
            }}
            disabled={
              shopifyOrdersnData?.total
                ? pageIndex >= Math.ceil(shopifyOrdersnData.total / limit)
                : true
            }
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}

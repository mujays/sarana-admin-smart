import useListTagihan from "@/features/tagihan/hooks/useListTagihan";
import SiswaServices from "@/services/siswa";
import TagihanService from "@/services/tagihan";
import { TTagihan } from "@/services/tagihan/tagihan.type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Select, Table } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

function SyncPage() {
  const [siswaValue, setSiswaValue] = useState<any>(null);
  const [lunasValue, setLunasValue] = useState<any>(null);
  const [selectedTagihan, setSelectedTagihan] = useState<TTagihan[]>([]);
  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: students, refetch } = useQuery({
    queryKey: ["STUDENTS_SYNC", type],
    queryFn: async () => {
      const response = await SiswaServices.get({
        page_size: 99999,
        page: 1,
        type,
      });
      return response;
    },
  });

  const studentsOptions =
    students?.data.map((s) => ({
      label: s?.nama,
      value: `${s?.id}-${s?.nama}`,
    })) || [];

  const { columns, isLoading, bills } = useListTagihan({
    limit: 200,
    page: 1,
    siswaId: +(siswaValue?.split("-")[0] as string),
    hideColumn: true,
  });

  const handleSync = async () => {
    if (!siswaValue && bills?.data.length === 0) return;
    setLoading(true);
    try {
      await TagihanService.sync({
        items: selectedTagihan?.map((bill) => ({
          id: bill.id,
          is_lunas: lunasValue,
        })),
      });
      setSelectedTagihan([]);
      queryClient.resetQueries({
        queryKey: ["STUDENTS_SYNC"],
      });
      refetch();
      toast.success("Tagihan berhasil disinkronisasi");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center pt-20 gap-5 px-10">
      <Select
        size="large"
        value={siswaValue}
        onChange={(val) => {
          setSiswaValue(val);
        }}
        placeholder="Siswa"
        className="w-40"
        showSearch
        options={studentsOptions as any}
      />
      <Select
        size="large"
        value={lunasValue}
        onChange={(val) => {
          setLunasValue(val);
        }}
        placeholder="Lunas / Belum Lunas"
        className="w-40"
        options={[
          { label: "Lunas", value: 1 },
          { label: "Belum Lunas", value: 0 },
        ]}
      />

      <Button
        disabled={!siswaValue || selectedTagihan.length === 0}
        onClick={handleSync}
        loading={loading}
      >
        Sync
      </Button>

      <div className="overflow-auto">
        <Table
          id="bill-table"
          columns={columns}
          dataSource={bills?.data}
          loading={isLoading}
          rowKey={(obj) => obj.id}
          rowSelection={{
            selectedRowKeys: selectedTagihan.map((tagihan) => tagihan.id),
            onChange(selectedRowKeys) {
              setSelectedTagihan(
                bills?.data.filter((bill) =>
                  selectedRowKeys.includes(bill.id),
                ) || [],
              );
            },
          }}
        />
      </div>
    </div>
  );
}

export default SyncPage;

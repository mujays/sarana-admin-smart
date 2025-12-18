import * as React from "react";
import { Button, Modal, Select, Tooltip, Typography } from "antd";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import errorResponse from "@/utils/error-response";
import { AxiosError } from "axios";
import SiswaServices from "@/services/siswa";
import { TPpdb } from "@/services/siswa/siswa.type";
import { toast } from "sonner";
import KelasServices from "@/services/kelas";

export function SelectClass({ ppdb }: { ppdb: TPpdb }) {
  const queryClient = useQueryClient();
  const modal = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);
  const [classId, setClassId] = React.useState<number | null>(null);

  const { data: kelas } = useQuery({
    queryKey: ["CLASSES"],
    queryFn: async () => {
      const response = await KelasServices.get({
        select: true,
        page: 1,
      });
      return response;
    },
  });

  async function onSubmit(val: any) {
    try {
      setIsLoading(true);
      await SiswaServices.updateSiswaPindahan(ppdb.id, {
        status: "RE_REGISTER",
        kelas_id: classId,
      });
      queryClient.invalidateQueries({ queryKey: ["PPDBS_PINDAHAN"] });
      toast.success("Data berhasil diperbarui");
      modal.onClose();
      setClassId(null);
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Tooltip title="Lengkapi">
      <Button
        data-select-id={ppdb.id}
        className="w-full px-3 border"
        type="default"
        onClick={() => modal.onOpen()}
      >
        Pilih Kelas
      </Button>

      <Modal
        title={
          <Typography.Title className="font-normal" level={3}>
            Luluskan Tes
          </Typography.Title>
        }
        maskClosable={false}
        open={modal.isOpen}
        onCancel={() => modal.onClose()}
        okText="Konfirmasi"
        okButtonProps={{
          onClick: onSubmit,
          loading: isLoading,
        }}
      >
        <div className="flex flex-col gap-2">
          <Typography.Text>Pilih Kelas</Typography.Text>
          <Select
            value={classId}
            placeholder="Pilih Kelas"
            options={kelas?.data.map((k) => ({
              label: k.nama,
              value: k.id,
            }))}
            onChange={(val) => {
              setClassId(val);
            }}
          />
        </div>
      </Modal>
    </Tooltip>
  );
}

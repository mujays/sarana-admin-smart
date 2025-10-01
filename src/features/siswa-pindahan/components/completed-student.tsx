import * as React from "react";
import { Button, Modal, Tooltip, Typography } from "antd";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useQueryClient } from "@tanstack/react-query";
import errorResponse from "@/utils/error-response";
import { AxiosError } from "axios";
import SiswaServices from "@/services/siswa";
import { TPpdb } from "@/services/siswa/siswa.type";
import { toast } from "sonner";

export function CompletedStudent({ ppdb }: { ppdb: TPpdb }) {
  const queryClient = useQueryClient();
  const modal = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);

  async function onSubmit(val: any) {
    try {
      setIsLoading(true);
      await SiswaServices.updateSiswaPindahan(ppdb.id, {
        is_past_to_test: true,
        status: "SELECT_CLASS",
      });
      queryClient.invalidateQueries({ queryKey: ["PPDBS_PINDAHAN"] });
      toast.success("Data berhasil diperbarui");
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Tooltip title="Lengkapi">
      <Button
        className="w-full px-3 border !text-blue-500 !border-blue-500"
        type="text"
        onClick={() => modal.onOpen()}
      >
        Lulus Tes
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
        <Typography.Text>
          Siswa ini akan resmi menjadi siswa setelah lolos test, apakah anda
          yakin?
        </Typography.Text>
      </Modal>
    </Tooltip>
  );
}

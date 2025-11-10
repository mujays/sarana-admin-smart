import { useDisclosure } from "@/hooks/useDisclosure";
import SiswaServices from "@/services/siswa";
import TagihanService from "@/services/tagihan";
import errorResponse from "@/utils/error-response";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import { TrashIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function DeletePpdb({ ppdbId }: { ppdbId: number }) {
  const queryClient = useQueryClient();
  const modal = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleDelete() {
    try {
      setIsLoading(true);
      await SiswaServices.deletePPDB(ppdbId);
      toast.success("Data berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["PPDBS"] });
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Tooltip title="Hapus">
      <Button
        className="w-full px-3 text-red-500"
        icon={<TrashIcon className="w-5 h-5 text-red-500" />}
        type="text"
        onClick={() => modal.onOpen()}
      ></Button>

      <Modal
        title={
          <Typography.Title className="font-normal" level={3}>
            Hapus Data Buku Tamu
          </Typography.Title>
        }
        open={modal.isOpen}
        onCancel={() => modal.onClose()}
        okText="Hapus"
        okButtonProps={{
          className: "bg-red-500",
          loading: isLoading,
        }}
        onOk={handleDelete}
      >
        <Typography.Text>
          Apakah yakin ingin menghapus data buku tamu?
        </Typography.Text>
      </Modal>
    </Tooltip>
  );
}

import { useDisclosure } from "@/hooks/useDisclosure";
import SiswaServices from "@/services/siswa";
import errorResponse from "@/utils/error-response";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import { TrashIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function DeleteSiswaMultiple({
  siswaIds,
  onSuccess,
}: {
  siswaIds: number[];
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const modal = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleDelete() {
    try {
      setIsLoading(true);
      await SiswaServices.deleteMultiple(siswaIds);
      toast.success("Siswa berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["STUDENTS"] });
      modal.onClose();
      onSuccess();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Tooltip title="Hapus">
      <Button
        className="w-full px-3 !text-white !bg-red-500"
        icon={<TrashIcon className="w-5 h-5 text-white" />}
        onClick={() => modal.onOpen()}
      >
        Hapus {siswaIds.length} Siswa
      </Button>

      <Modal
        maskClosable={false}
        title={
          <Typography.Title className="font-normal" level={3}>
            Hapus {siswaIds.length} Siswa
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
          Apakah yakin ingin menghapus data siswa yang dipilih?
        </Typography.Text>
      </Modal>
    </Tooltip>
  );
}

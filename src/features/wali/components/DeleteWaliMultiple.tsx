import { useDisclosure } from "@/hooks/useDisclosure";
import WaliService from "@/services/wali";
import errorResponse from "@/utils/error-response";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import { TrashIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function DeleteWaliMultiple({
  waliIds,
  onSuccess,
}: {
  waliIds: number[];
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const modal = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleDelete() {
    try {
      setIsLoading(true);
      await WaliService.deleteMultiple(waliIds);
      toast.success("Wali berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["WALIES"] });
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
        Hapus {waliIds.length} Wali
      </Button>

      <Modal
        maskClosable={false}
        title={
          <Typography.Title className="font-normal" level={3}>
            Hapus {waliIds.length} Wali
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
          Apakah yakin ingin menghapus data wali yang dipilih?
        </Typography.Text>
      </Modal>
    </Tooltip>
  );
}

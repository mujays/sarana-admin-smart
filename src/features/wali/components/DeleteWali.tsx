import * as React from "react";
import { Button, Modal, Tooltip, Typography } from "antd";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import errorResponse from "@/utils/error-response";
import { AxiosError } from "axios";
import { TrashIcon } from "lucide-react";
import WaliService from "@/services/wali";

export function DeleteWali({ walidId }: { walidId: number }) {
  const queryClient = useQueryClient();
  const modal = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleDelete() {
    try {
      setIsLoading(true);
      await WaliService.delete(walidId);
      toast.success("Data berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["WALIES"] });
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
            Hapus Wali
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
          Apakah yakin ingin menghapus data wali?
        </Typography.Text>
      </Modal>
    </Tooltip>
  );
}

import { useDisclosure } from "@/hooks/useDisclosure";
import AkademikService from "@/services/akademik";
import errorResponse from "@/utils/error-response";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Typography } from "antd";
import { AxiosError } from "axios";
import { TrashIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function DeleteMapel({ mapelId }: { mapelId: number }) {
  const queryClient = useQueryClient();
  const modal = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleDelete() {
    try {
      setIsLoading(true);
      await AkademikService.deleteMapel(mapelId);
      toast.success("Mata pelajaran berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["MAPEL"] });
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button
        data-delete-id={mapelId}
        type="text"
        icon={<TrashIcon className="h-4 w-4" />}
        onClick={() => modal.onOpen()}
        className="text-red-600 hover:text-red-800"
      />

      <Modal
        title={
          <Typography.Title className="font-normal" level={3}>
            Hapus Mata Pelajaran
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
          Apakah yakin ingin menghapus mata pelajaran ini?
        </Typography.Text>
      </Modal>
    </>
  );
}

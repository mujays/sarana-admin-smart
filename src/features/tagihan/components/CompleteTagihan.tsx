import { useDisclosure } from "@/hooks/useDisclosure";
import TagihanService from "@/services/tagihan";
import { TTagihan } from "@/services/tagihan/tagihan.type";
import errorResponse from "@/utils/error-response";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import { CheckIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function CompleteTagihan({
  tagihanIds,
  onSuccess,
  isLunas,
}: {
  tagihanIds?: number[];
  onSuccess: () => void;
  isLunas: boolean;
}) {
  const queryClient = useQueryClient();
  const modal = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleComplete() {
    try {
      await TagihanService.sync({
        items: tagihanIds?.map((id) => ({
          id,
          is_lunas: isLunas,
        })),
      });
      queryClient.invalidateQueries({
        queryKey: ["BILLS"],
      });
      toast.success("Data berhasil diperbarui");
      onSuccess();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Tooltip title="Lunasi">
      <Button
        className="w-full px-3 text-green-500"
        onClick={() => modal.onOpen()}
        type="link"
      >
        {isLunas ? "Lunasi" : "Batalkan Lunasi"}
      </Button>

      <Modal
        title={
          <Typography.Title className="font-normal" level={3}>
            {isLunas ? "Lunasi Tagihan" : "Batalkan Pelunasan Tagihan"}
          </Typography.Title>
        }
        open={modal.isOpen}
        onCancel={() => modal.onClose()}
        okText="Lunasi"
        okButtonProps={{
          className: "bg-red-500",
          loading: isLoading,
        }}
        onOk={handleComplete}
      >
        <Typography.Text>
          Apakah yakin ingin {isLunas ? "melunasi" : "membatalkan pelunasan"}{" "}
          tagihan ini?
        </Typography.Text>
      </Modal>
    </Tooltip>
  );
}

import { useDisclosure } from "@/hooks/useDisclosure";
import TagihanService from "@/services/tagihan";
import { TTagihanAdmission } from "@/services/tagihan/tagihan.type";
import errorResponse from "@/utils/error-response";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import { CheckIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function CompleteTagihanAdmission({
  tagihan,
}: {
  tagihan: TTagihanAdmission;
}) {
  const queryClient = useQueryClient();
  const modal = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleComplete() {
    try {
      setIsLoading(true);
      await TagihanService.updateLunas({
        ids: [tagihan.id],
      });
      toast.success("Tagihan berhasil dilunasi!");
      queryClient.invalidateQueries({ queryKey: ["BILLS_ADMISSION"] });
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
        icon={<CheckIcon className="w-5 h-5 text-green-500" />}
        type="text"
        onClick={() => modal.onOpen()}
      ></Button>

      <Modal
        title={
          <Typography.Title className="font-normal" level={3}>
            Lunasi Tagihan
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
          Apakah yakin ingin melunasi tagihan ini?
        </Typography.Text>
      </Modal>
    </Tooltip>
  );
}

import { useDisclosure } from "@/hooks/useDisclosure";
import TagihanService from "@/services/tagihan";
import errorResponse from "@/utils/error-response";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Typography } from "antd";
import { CheckIcon, XIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function ConfirmPayment({
  transactionId,
  status,
  type = "tgh",
}: {
  transactionId: number;
  status: "berhasil" | "gagal";
  type?: "tgh" | "adm";
}) {
  const queryClient = useQueryClient();
  const modal = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleConfirm() {
    try {
      setIsLoading(true);
      if (type === "tgh") {
        const res = await TagihanService.updateStatusTrx(transactionId, {
          status,
        });
        toast.success("Status Berhasil Diubah");
        queryClient.resetQueries({
          queryKey: ["TRX"],
        });
      } else {
        const res = await TagihanService.updateStatusTrxAdmission(
          transactionId,
          {
            status,
          },
        );
        toast.success("Status Berhasil Diubah");
        queryClient.resetQueries({
          queryKey: ["TRX_ADM"],
        });
      }
    } catch (error: any) {
      errorResponse(error);
    } finally {
      setIsLoading(false);
      modal.onClose();
    }
  }

  return (
    <>
      <Button
        icon={
          status === "berhasil" ? (
            <CheckIcon className="w-4 h-4 text-green-500" />
          ) : (
            <XIcon className="w-4 h-4 text-red-500" />
          )
        }
        type="text"
        onClick={() => modal.onOpen()}
      />

      <Modal
        title={
          <Typography.Title className="font-normal" level={3}>
            {status === "berhasil" ? "Terima Pembayaran" : "Tolak Pembayaran"}
          </Typography.Title>
        }
        open={modal.isOpen}
        onCancel={() => modal.onClose()}
        okText={status === "berhasil" ? "Konfirmasi" : "Tolak"}
        okButtonProps={{
          className: status === "berhasil" ? "!bg-blue-500" : "!bg-red-500",
          loading: isLoading,
        }}
        confirmLoading={isLoading}
        onOk={handleConfirm}
      >
        <Typography.Text>
          Apakah yakin ingin {status === "berhasil" ? "konfirmasi" : "menolak"}{" "}
          pembayaran?
        </Typography.Text>
      </Modal>
    </>
  );
}

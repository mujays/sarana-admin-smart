import * as React from "react";
import { Button, Modal, Tooltip, Typography } from "antd";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import errorResponse from "@/utils/error-response";
import { AxiosError } from "axios";
import SiswaServices from "@/services/siswa";

export function AcceptStudent({ ppdbId }: { ppdbId: number }) {
  const queryClient = useQueryClient();
  const modal = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleAccept() {
    try {
      setIsLoading(true);
      await SiswaServices.updateSiswaPindahan(ppdbId, {
        // is_past_to_test: true,
        bukti_pembayaran: "oke",
        status: "PENDING_INPUT",
        is_lunas: true,
      });
      toast.success("Berhasil Dikonfirmasi!");
      queryClient.invalidateQueries({ queryKey: ["PPDBS_PINDAHAN"] });
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Tooltip title="Konfirmasi">
      <Button
        data-accept-id={ppdbId}
        className="w-full px-3 border !text-green-500 !border-green-500"
        type="text"
        onClick={() => modal.onOpen()}
      >
        Konfirmasi Pembayaran
      </Button>

      <Modal
        title={
          <Typography.Title className="font-normal" level={3}>
            Konfirmasi Pembayaran
          </Typography.Title>
        }
        open={modal.isOpen}
        onCancel={() => modal.onClose()}
        okText="Konfirmasi"
        okButtonProps={{
          loading: isLoading,
        }}
        onOk={handleAccept}
      >
        <Typography.Text>
          Apakah yakin ingin mengkonfirmasi pembayaran?
        </Typography.Text>
      </Modal>
    </Tooltip>
  );
}

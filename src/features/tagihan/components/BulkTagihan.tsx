import CurrencyInput from "@/components/currency-input";
import { useDisclosure } from "@/hooks/useDisclosure";
import TagihanService from "@/services/tagihan";
import errorResponse from "@/utils/error-response";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Typography } from "antd";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

function BuklTagihan({
  tagihanIds,
  onSuccess,
}: {
  tagihanIds?: number[];
  onSuccess: () => void;
}) {
  const modal = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [nominal, setNominal] = useState("");
  const router = useRouter();

  const queryClient = useQueryClient();
  const { siswaId } = router.query;

  const onSubmit = async () => {
    try {
      setLoading(true);
      await TagihanService.sync({
        items: tagihanIds?.map((id) => ({
          id,
          biaya: nominal.replaceAll(".", ""),
        })),
      });
      queryClient.invalidateQueries({
        queryKey: ["BILLS"],
      });
      toast.success("Data berhasil diperbarui");
      setNominal("");
      onSuccess();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => modal.onOpen()}>
        <span className="!hidden md:!inline">Ubah Biaya</span>
      </Button>
      <Modal
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
        }}
        okText="Simpan"
        okButtonProps={{
          onClick: onSubmit,
          disabled: !nominal,
        }}
        confirmLoading={loading}
        title={
          <Typography.Title level={4}>
            Ubah Semua Biaya yang dipilih
          </Typography.Title>
        }
      >
        <CurrencyInput
          value={nominal}
          onChange={(v) => setNominal(v?.toString() ?? "")}
        />
      </Modal>
    </>
  );
}

export default BuklTagihan;

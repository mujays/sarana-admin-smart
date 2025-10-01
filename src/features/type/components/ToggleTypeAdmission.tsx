import * as React from "react";
import { Button, Modal, Tooltip, Typography } from "antd";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import errorResponse from "@/utils/error-response";
import { AxiosError } from "axios";
import TypeServices from "@/services/type";
import { PoweroffOutlined } from "@ant-design/icons";
import { TTypeAdmission } from "@/services/type/type.type";

export function ToggleTypeAdmission({
  typeId,
  data,
}: {
  typeId: number;
  data: TTypeAdmission;
}) {
  const queryClient = useQueryClient();
  const modal = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleStatus() {
    try {
      setIsLoading(true);
      await TypeServices.updateAdmissionType(typeId, {
        ...data,
        status: data.status === "active" ? "inactive" : "active",
      });
      toast.success("Status berhasil diubah!");
      queryClient.invalidateQueries({ queryKey: ["TYPES_ADMISSION"] });
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Tooltip title="Status">
      <Button
        className="w-full px-3 !text-lime-500"
        icon={<PoweroffOutlined className="w-5 h-5 !text-lime-500" />}
        type="text"
        onClick={() => modal.onOpen()}
      ></Button>

      <Modal
        title={
          <Typography.Title className="font-normal" level={3}>
            Ubah Status Tipe
          </Typography.Title>
        }
        open={modal.isOpen}
        onCancel={() => modal.onClose()}
        okText="Ubah"
        okButtonProps={{
          loading: isLoading,
        }}
        onOk={handleStatus}
      >
        <Typography.Text>
          Apakah yakin ingin mengubah status Tipe?
        </Typography.Text>
      </Modal>
    </Tooltip>
  );
}

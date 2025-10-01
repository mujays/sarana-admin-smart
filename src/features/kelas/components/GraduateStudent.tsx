import { useDisclosure } from "@/hooks/useDisclosure";
import KelasServices from "@/services/kelas";
import errorResponse from "@/utils/error-response";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Modal, Typography } from "antd";
import { AxiosError } from "axios";
import { GraduationCap } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

function GraduateStudent({
  clear,
  siswaInClass,
}: {
  siswaInClass: number[];
  clear: () => void;
}) {
  const modal = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const { query, back } = useRouter();
  const kelasId: string = query.kelasId as string;

  const queryClient = useQueryClient();
  const handleGraduate = async (val: any) => {
    try {
      setLoading(true);
      await KelasServices.update(+kelasId, {
        lulus: 1,
        siswa: siswaInClass,
      });

      toast.success("Siswa berhasil diluluskan!");

      form.resetFields();
      queryClient.resetQueries();
      clear();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
      modal.onClose();
    }
  };

  return (
    <>
      <Button
        onClick={() => modal.onOpen()}
        type="link"
        className="!border !border-green-500 !text-green-500"
        icon={<GraduationCap />}
      >
        Luluskan
      </Button>

      <Modal
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
        }}
        okText="Luluskan"
        okButtonProps={{
          loading: loading,
        }}
        onOk={handleGraduate}
        title={<Typography.Title level={4}>Luluskan Siswa</Typography.Title>}
      >
        <Typography.Text>
          Apakah yakin ingin meluluskan siswa dikelas ini?
        </Typography.Text>
      </Modal>
    </>
  );
}

export default GraduateStudent;

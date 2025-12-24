import { Modal, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AkademikService from "@/services/akademik";
import { TSemester } from "@/services/akademik/akademik.type";
import { toast } from "sonner";

interface DeleteSemesterProps {
  open: boolean;
  onClose: () => void;
  semester: TSemester | null;
}

export const DeleteSemester = ({
  open,
  onClose,
  semester,
}: DeleteSemesterProps) => {
  const queryClient = useQueryClient();

  const { mutate: deleteSemester, isPending } = useMutation({
    mutationFn: async (id: number) => {
      const response = await AkademikService.deleteSemester(id);
      return response;
    },
    onSuccess: () => {
      toast.success("Semester berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["LIST_SEMESTER"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Gagal menghapus semester!",
      );
    },
  });

  const handleConfirm = () => {
    if (semester?.id) {
      deleteSemester(semester.id);
    }
  };

  return (
    <Modal
      title="Hapus Semester"
      open={open}
      onCancel={onClose}
      onOk={handleConfirm}
      confirmLoading={isPending}
      okText="Hapus"
      cancelText="Batal"
      okButtonProps={{ danger: true }}
    >
      <p>
        Apakah Anda yakin ingin menghapus semester{" "}
        <strong>&ldquo;{semester?.nama}&rdquo;</strong>?
      </p>
      <p className="text-gray-500 text-sm">
        Tindakan ini tidak dapat dibatalkan.
      </p>
    </Modal>
  );
};

import PerpusService from "@/services/perpus";
import errorResponse from "@/utils/error-response";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Modal } from "antd";
import { AxiosError } from "axios";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  bookId: number;
};

export function DeleteBook({ bookId }: Props) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      setLoading(true);
      await PerpusService.deleteBook(bookId);
      queryClient.invalidateQueries({
        queryKey: ["BOOKS"],
      });
      toast.success("Buku berhasil dihapus");
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "Hapus Buku",
      content: "Apakah Anda yakin ingin menghapus buku ini?",
      okText: "Ya, Hapus",
      okType: "danger",
      cancelText: "Batal",
      onOk() {
        return handleDelete();
      },
    });
  };

  return (
    <Button
      onClick={showDeleteConfirm}
      icon={<TrashIcon className="w-4 h-4" />}
      type="primary"
      danger
      size="small"
      loading={loading}
    >
      Hapus
    </Button>
  );
}

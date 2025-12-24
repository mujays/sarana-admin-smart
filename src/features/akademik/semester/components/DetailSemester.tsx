import { Modal, Descriptions, Tag, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import AkademikService from "@/services/akademik";
import TahunAjaranService from "@/services/tahun-ajaran";
import dayjs from "dayjs";

interface DetailSemesterProps {
  open: boolean;
  onClose: () => void;
  semesterId: number | null;
}

export const DetailSemester = ({
  open,
  onClose,
  semesterId,
}: DetailSemesterProps) => {
  // Get semester detail
  const { data: semesterDetail, isLoading: isLoadingSemester } = useQuery({
    queryKey: ["SEMESTER_DETAIL", semesterId],
    queryFn: async () => {
      if (semesterId) {
        const response = await AkademikService.getOneSemester(semesterId);
        return response.data;
      }
      return null;
    },
    enabled: !!semesterId && open,
  });

  // Get tahun ajaran detail
  const { data: tahunAjaranDetail, isLoading: isLoadingTahunAjaran } = useQuery(
    {
      queryKey: ["TAHUN_AJARAN_DETAIL", semesterDetail?.tahun_ajaran_id],
      queryFn: async () => {
        if (semesterDetail?.tahun_ajaran_id) {
          const response = await TahunAjaranService.getOne(
            semesterDetail.tahun_ajaran_id,
          );
          return response.data;
        }
        return null;
      },
      enabled: !!semesterDetail?.tahun_ajaran_id && open,
    },
  );

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD MMMM YYYY");
  };

  const getSemesterTypeName = (nomor: number) => {
    return nomor === 1 ? "Ganjil" : "Genap";
  };

  return (
    <Modal
      title="Detail Semester"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {isLoadingSemester ? (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      ) : (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Nama Semester">
            {semesterDetail?.nama}
          </Descriptions.Item>

          <Descriptions.Item label="Nomor Semester">
            <Tag color={semesterDetail?.nomor === 1 ? "blue" : "green"}>
              {semesterDetail?.nomor} (
              {getSemesterTypeName(semesterDetail?.nomor || 1)})
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Tahun Ajaran">
            {isLoadingTahunAjaran ? (
              <Spin size="small" />
            ) : (
              tahunAjaranDetail?.name || "-"
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Tanggal Mulai">
            {semesterDetail?.tanggal_mulai
              ? formatDate(semesterDetail.tanggal_mulai)
              : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Tanggal Akhir">
            {semesterDetail?.tanggal_akhir
              ? formatDate(semesterDetail.tanggal_akhir)
              : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag color={semesterDetail?.is_active ? "success" : "error"}>
              {semesterDetail?.is_active ? "Aktif" : "Tidak Aktif"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Dibuat">
            {semesterDetail?.created_at
              ? formatDate(semesterDetail.created_at)
              : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Diperbarui">
            {semesterDetail?.updated_at
              ? formatDate(semesterDetail.updated_at)
              : "-"}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

import { useDisclosure } from "@/hooks/useDisclosure";
import { TMataPelajaran } from "@/services/akademik/akademik.type";
import { Button, Modal, Typography, Tag, Descriptions } from "antd";
import { Eye } from "lucide-react";
import moment from "moment";
import "moment/locale/id";

function DetailMapel({ mapel }: { mapel: TMataPelajaran }) {
  const modal = useDisclosure();

  return (
    <>
      <Button
        data-mapel-id={mapel.id}
        icon={<Eye className="w-4 h-4 text-primary-500 cursor-pointer" />}
        onClick={() => {
          modal.onOpen();
        }}
        type="text"
      />

      <Modal
        open={modal.isOpen}
        onCancel={() => {
          modal.onClose();
        }}
        footer={null}
        title={
          <Typography.Title level={4}>Detail Mata Pelajaran</Typography.Title>
        }
        width={600}
      >
        <div className="space-y-4">
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Kode">
              <Typography.Text strong>{mapel.kode}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Nama Mata Pelajaran">
              <Typography.Text>{mapel.nama}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Deskripsi">
              <Typography.Text>{mapel.deskripsi}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={mapel.is_active ? "green" : "red"}>
                {mapel.is_active ? "Aktif" : "Tidak Aktif"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tanggal Dibuat">
              <Typography.Text>
                {moment(mapel.created_at).format("DD MMMM YYYY, HH:mm")}
              </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Terakhir Diperbarui">
              <Typography.Text>
                {moment(mapel.updated_at).format("DD MMMM YYYY, HH:mm")}
              </Typography.Text>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Modal>
    </>
  );
}

export default DetailMapel;

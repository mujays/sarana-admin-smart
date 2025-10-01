import { useDisclosure } from "@/hooks/useDisclosure";
import { TKeluarga } from "@/services/keluarga/keluarga.type";
import { Button, Form, Image, Modal, Tooltip, Typography } from "antd";
import { Eye } from "lucide-react";
import moment from "moment";
import "moment/locale/id";

function DetailKeluarga({ keluarga }: { keluarga: TKeluarga }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();

  return (
    <Tooltip title="Detail">
      <Button
        icon={<Eye className="w-5 h-5 !text-blue-500 cursor-pointer" />}
        onClick={() => {
          modal.onOpen();
        }}
        type="text"
      ></Button>
      <Modal
        open={modal.isOpen}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
        }}
        footer={false}
        title={<Typography.Title level={4}>Detail</Typography.Title>}
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-3">
          <div>
            <p className="font-semibold">Nama Calon Siswa</p>
            <p>{keluarga.nama}</p>
          </div>
          <div>
            <p className="font-semibold">Tanggal Lahir</p>
            <p>{moment(keluarga.tanggal_lahir).format("LL")}</p>
          </div>

          {["Ayah", "Ibu"].includes(keluarga.hubungan) && (
            <div>
              <p className="font-semibold">NIK</p>
              <p>{keluarga?.nik || "-"}</p>
            </div>
          )}

          <div>
            <p className="font-semibold">Hubungan</p>
            <p>{keluarga.hubungan}</p>
          </div>
          <div>
            <p className="font-semibold">Agama</p>
            <p>{keluarga.agama}</p>
          </div>
          <div>
            <p className="font-semibold">Jenis Kelamin</p>
            <p>{keluarga.jenis_kelamin}</p>
          </div>

          {["Ayah", "Ibu"].includes(keluarga.hubungan) && (
            <div>
              <p className="font-semibold">KTP</p>
              <Image src={keluarga.ktp} alt="KTP" className="!w-20" />
            </div>
          )}
          <div className="mb-3">
            <p className="font-semibold">Alamat</p>
            <p>{keluarga.alamat}</p>
          </div>
        </div>
      </Modal>
    </Tooltip>
  );
}

export default DetailKeluarga;

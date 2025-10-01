import { useDisclosure } from "@/hooks/useDisclosure";
import { TPpdb } from "@/services/siswa/siswa.type";
import { Button, Form, Modal, Tooltip, Typography } from "antd";
import { Eye } from "lucide-react";
import moment from "moment";
import "moment/locale/id";

function DetailPPDB({ ppdb }: { ppdb: TPpdb }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();

  return (
    <Tooltip title="Detail">
      <Button
        icon={<Eye className="w-5 h-5 text-primary-500 cursor-pointer" />}
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
            <p>{ppdb.nama_siswa}</p>
          </div>
          <div>
            <p className="font-semibold">Tanggal Lahir</p>
            <p>{moment(ppdb.tanggal_lahir).format("LL")}</p>
          </div>
          <div>
            <p className="font-semibold">Sekolah Asal</p>
            <p>{ppdb.sekolah_asal}</p>
          </div>
          <div>
            <p className="font-semibold">NPSN Sekolah Asal</p>
            <p>{ppdb.npsn_asal}</p>
          </div>
          <div>
            <p className="font-semibold">Tujuan Kelas</p>
            <p>Kelas {ppdb.tingkatan_id}</p>
          </div>
          <div>
            <p className="font-semibold">Tingkat</p>
            <p>{ppdb.types}</p>
          </div>
          <div>
            <p className="font-semibold">Nama Wali</p>
            <p>{ppdb.nama_orang_tua}</p>
          </div>
          <div>
            <p className="font-semibold">Nomor Telepon Wali</p>
            <p>{ppdb.no_hp_orang_tua}</p>
          </div>
        </div>

        <div className="mb-3">
          <p className="font-semibold">Alamat</p>
          <p>{ppdb.alamat}</p>
        </div>
        <div className="mb-3">
          <p className="font-semibold">
            Mengetahui Informasi Smart School dari?
          </p>
          <p>{ppdb.know_from}</p>
        </div>
        <div className="mb-3">
          <p className="font-semibold">Alasan Masuk Smart School</p>
          <p>{ppdb.reason}</p>
        </div>
      </Modal>
    </Tooltip>
  );
}

export default DetailPPDB;

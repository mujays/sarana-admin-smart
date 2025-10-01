import { useDisclosure } from "@/hooks/useDisclosure";
import {
  TTransaction,
  TTransactionAdmission,
} from "@/services/tagihan/tagihan.type";
import { formatCurrency, numberToWordsID } from "@/stores/utils";
import { Button, Modal, Typography } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import * as React from "react";

export function Invoices({
  transactions,
}: {
  transactions: TTransaction | TTransactionAdmission;
}) {
  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];
  const modal = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);
  const [imageData, setImageData] = React.useState("");

  const pdfRef = React.useRef<HTMLDivElement>(null);

  const tagihan =
    (transactions as TTransactionAdmission)?.uang_pangkal ||
    (transactions as TTransaction)?.tagihan;

  const generateImage = async () => {
    try {
      setIsLoading(true);
      if (pdfRef?.current) {
        const clonedElement = pdfRef.current.cloneNode(true) as HTMLDivElement;
        clonedElement.style.display = "block";
        clonedElement.style.width = "1240px";
        clonedElement.style.padding = "50px";

        clonedElement.style.position = "absolute";
        clonedElement.style.left = "-999999px";

        document.body.appendChild(clonedElement);
        const canvas = await html2canvas(clonedElement, { scale: 2 });
        const imageData = canvas.toDataURL("image/png", 0.7);
        document.body.removeChild(clonedElement);
        setImageData(imageData);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  async function handleConfirm() {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true, // compress data stream
    });
    const imgWidth = 210; // A4 width in mm

    const imgProps = pdf.getImageProperties(imageData);
    const imgRatio = imgProps.height / imgProps.width;
    const imgHeight = imgWidth * imgRatio;

    pdf.addImage(
      imageData,
      "JPEG",
      0,
      0,
      imgWidth,
      imgHeight + 5,
      undefined,
      "FAST",
    );
    pdf.save(`${tagihan?.siswa.nama}-${tagihan?.siswa.nis}-${tagihan?.id}.pdf`);
  }

  React.useEffect(() => {
    if (modal.isOpen) {
      generateImage();
    }
  }, [pdfRef, modal.isOpen]);

  return (
    <>
      <Button type="primary" onClick={() => modal.onOpen()}>
        Lihat Invoice
      </Button>

      <Modal
        title={
          <Typography.Title className="font-normal" level={3}>
            Invoice
          </Typography.Title>
        }
        open={modal.isOpen}
        onCancel={() => modal.onClose()}
        okButtonProps={{
          loading: isLoading,
        }}
        confirmLoading={isLoading}
        onOk={handleConfirm}
        width="1000px"
        okText="Download"
        loading={isLoading}
      >
        <div className="space-y-3 relative">
          {transactions.status.toLowerCase() === "berhasil" && (
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-gray-300 font-bold text-[10rem] rotate-[-20deg] opacity-30 border-4 border-gray-300 px-20 py-2 rounded-md">
              LUNAS
            </div>
          )}
          <div className="flex gap-2 items-center border-b pb-2">
            <Image
              width={500}
              height={300}
              alt="Invoice"
              src="/icons/smart-icon.svg"
              className="w-14"
            />
            {type === "sd" ? (
              <div>
                <p className="font-medium text-lg">SDS SMART SCHOOL</p>
                <p>Jl. Kecapi No. 49 Jagakarsa</p>
                <p className="text-xs">
                  Telp. 0217872540 Kota Jakarta Selatan D.K.I Jakarta INDONESIA
                </p>
              </div>
            ) : (
              <div>
                <p className="font-medium text-lg">SMP SMART SCHOOL</p>
                <p>Jl. Klp. 3 No.75, RT.6/RW.3 Jagakarsa</p>
                <p className="text-xs">
                  Telp. 0217872540 Kota Jakarta Selatan D.K.I Jakarta INDONESIA
                </p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-center uppercase font-semibold">
              Tanda Bukti Pembayaran Siswa
            </p>
            <div className="grid grid-cols-2">
              <div className="space-y-1">
                <div className="flex gap-3">
                  <p className="w-[100px]">NIS</p>
                  <p>: {tagihan?.siswa?.nis || "-"}</p>
                </div>
                <div className="flex gap-3">
                  <p className="w-[100px]">Nama</p>
                  <p>: {tagihan?.siswa.nama}</p>
                </div>
                <div className="flex gap-3">
                  <p className="w-[100px]">Kelas</p>
                  <p>: {tagihan?.siswa.kelas?.[0].nama || "-"}</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex gap-3">
                  <p className="w-[120px]">No. Tagihan</p>
                  <p>: {tagihan?.id}</p>
                </div>
                <div className="flex gap-3">
                  <p className="w-[120px] whitespace-nowrap">Nama Tagihan</p>
                  <p>: {tagihan?.nama || tagihan?.tagihan}</p>
                </div>
                <div className="flex gap-3">
                  <p className="w-[120px] whitespace-nowrap">Tanggal Bayar</p>
                  <p>
                    :{" "}
                    {transactions.payment_at
                      ? moment(transactions.payment_at).format("LL")
                      : "Belum dibayar"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <table className="min-w-full border text-xs border-gray-200 rounded-lg">
            {/* Header */}
            <thead className="bg-gray-100">
              <tr className="">
                <th className="px-4 py-1 border text-center">Tanggal</th>
                <th className="px-4 py-1 border text-center">Keterangan</th>
                <th className="px-4 py-1 border text-center">Biaya</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-1 border text-center">
                  {moment(transactions.created_at).format("LL")}
                </td>
                <td className="px-4 py-1 border text-center">
                  {tagihan?.tagihan || tagihan?.nama}
                </td>
                <td className="px-4 py-1 border text-center">
                  {formatCurrency(transactions.buyer_payment)}
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-1 border text-center" colSpan={2}>
                  *** Jumlah ***
                </td>
                <td className="px-4 py-1 border text-center">
                  {formatCurrency(transactions.buyer_payment)}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="space-y-2">
            <p className="text-center">
              *) Sah jika ada cetakan data komputer atau tanda tangan yang
              berwenang. Jakarta Selatan,{" "}
              {moment().format("Do MMMM YYYY, h:mm:ss")}.
            </p>

            <p className="capitalize text-center">
              Jumlah : {formatCurrency(transactions.buyer_payment)} (
              {numberToWordsID(transactions.buyer_payment)})
            </p>

            <div className="flex justify-around">
              <div className="space-y-14">
                <p>Tanda Tangan</p>
                <p className="text-center">Risma Amelia</p>
              </div>
            </div>
          </div>
        </div>

        {/* RESULT PDF */}

        <div className="space-y-3 hidden absolute" ref={pdfRef}>
          {transactions.status.toLowerCase() === "berhasil" && (
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-gray-300 font-bold text-[10rem] rotate-[-20deg] opacity-30 border-4 border-gray-300 px-20 pb-[100px] rounded-md">
              LUNAS
            </div>
          )}
          <div className="flex gap-2 items-center pb-5 border-b">
            <Image
              width={500}
              height={300}
              alt="Invoice"
              src="/icons/smart-icon.svg"
              className="w-14"
            />
            {type === "sd" ? (
              <div>
                <p className="font-medium text-lg">SDS SMART SCHOOL</p>
                <p>Jl. Kecapi No. 49 Jagakarsa</p>
                <p className="text-xs">
                  Telp. 0217872540 Kota Jakarta Selatan D.K.I Jakarta INDONESIA
                </p>
              </div>
            ) : (
              <div>
                <p className="font-medium text-lg">SMP SMART SCHOOL</p>
                <p>Jl. Klp. 3 No.75, RT.6/RW.3 Jagakarsa</p>
                <p className="text-xs">
                  Telp. 0217872540 Kota Jakarta Selatan D.K.I Jakarta INDONESIA
                </p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-center uppercase font-semibold">
              Tanda Bukti Pembayaran Siswa
            </p>
            <div className="grid grid-cols-2">
              <div className="space-y-1">
                <div className="flex gap-3">
                  <p className="w-[100px]">NIS</p>
                  <p>: {tagihan?.siswa?.nis || "-"}</p>
                </div>
                <div className="flex gap-3">
                  <p className="w-[100px]">Nama</p>
                  <p>: {tagihan?.siswa.nama}</p>
                </div>
                <div className="flex gap-3">
                  <p className="w-[100px]">Kelas</p>
                  <p>: {tagihan?.siswa.kelas?.[0].nama || "-"}</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex gap-3">
                  <p className="w-[120px]">No. Tagihan</p>
                  <p>: {tagihan?.id}</p>
                </div>
                <div className="flex gap-3">
                  <p className="w-[120px] whitespace-nowrap">Nama Tagihan</p>
                  <p>: {tagihan?.nama || tagihan?.tagihan}</p>
                </div>
                <div className="flex gap-3">
                  <p className="w-[120px] whitespace-nowrap">Tanggal Bayar</p>
                  <p>
                    :{" "}
                    {transactions.payment_at
                      ? moment(transactions.payment_at).format("LL")
                      : "Belum dibayar"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <table className="min-w-full border text-xs border-gray-200 rounded-lg">
            {/* Header */}
            <thead className="bg-gray-100">
              <tr className="">
                <th className="pb-4 px-4 py-1 border text-center">Tanggal</th>
                <th className="pb-4 px-4 py-1 border text-center">
                  Keterangan
                </th>
                <th className="pb-4 px-4 py-1 border text-center">Biaya</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 pb-4 py-1 border text-center">
                  {moment(transactions.created_at).format("LL")}
                </td>
                <td className="px-4 pb-4 py-1 border text-center">
                  {tagihan?.tagihan || tagihan?.nama}
                </td>
                <td className="px-4 pb-4 py-1 border text-center">
                  {formatCurrency(transactions.buyer_payment)}
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 pb-4 py-1 border text-center" colSpan={2}>
                  *** Jumlah ***
                </td>
                <td className="px-4 pb-4 py-1 border text-center">
                  {formatCurrency(transactions.buyer_payment)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="space-y-2">
            <p className="text-center">
              *) Sah jika ada cetakan data komputer atau tanda tangan yang
              berwenang. Jakarta Selatan,{" "}
              {moment().format("Do MMMM YYYY, h:mm:ss")}.
            </p>

            <p className="capitalize text-center">
              Jumlah : {formatCurrency(transactions.buyer_payment)} (
              {numberToWordsID(transactions.buyer_payment)})
            </p>

            <div className="flex justify-around">
              <div className="space-y-14">
                <p>Tanda Tangan</p>
                <p className="text-center">Risma Amelia</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

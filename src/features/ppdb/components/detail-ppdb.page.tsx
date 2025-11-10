import { ReactElement, useEffect, useMemo, useRef, useState } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import Head from "next/head";
import classNames from "classnames";
import { Breadcrumb } from "@/features/navigation/components/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Button } from "antd";
import { ChevronLeftIcon, DownloadIcon } from "lucide-react";
import { Spin } from "@/components/spin";
import SiswaServices from "@/services/siswa";
import html2canvas from "html2canvas";
import moment from "moment";
import Image from "next/image";
import jsPDF from "jspdf";
import { formatCurrency } from "@/stores/utils";

export default function DetailPPDB() {
  const router = useRouter();
  const paths = router.pathname.split("/");
  const { siswaId } = router.query;

  const [imageData, setImageData] = useState("");

  const pdfRef = useRef<HTMLDivElement>(null);

  const generateImage = async () => {
    try {
      if (pdfRef?.current) {
        const clonedElement = pdfRef.current.cloneNode(true) as HTMLDivElement;
        clonedElement.style.display = "block";
        clonedElement.style.width = "1240px";

        clonedElement.style.position = "absolute";
        clonedElement.style.left = "-999999px";

        document.body.appendChild(clonedElement);
        const canvas = await html2canvas(clonedElement, { scale: 2 });
        const imageData = canvas.toDataURL("image/png", 0.7);
        document.body.removeChild(clonedElement);
        setImageData(imageData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const downloadImage = () => {
    const avatarUrl = siswa?.data_siswa?.avatar;
    if (avatarUrl) {
      const link = document.createElement("a");
      link.href = avatarUrl;
      link.download = `${siswa?.data_siswa?.nama || "siswa"}-foto.jpg`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const { data: siswa, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["PPDB", router.query?.siswaId],
    enabled: !!siswaId,
    queryFn: async () => {
      const response = await SiswaServices.getPPDBDetail(
        +(siswaId as string),
        {
          // with: "kelas,keluarga,history_kelas.tahunAjaran,history_kelas.kelas",
        },
        paths[3] === "siswa-pindahan",
      );
      return response.data;
    },
  });

  console.log({ siswa });

  const dataAyah = useMemo(() => {
    if (siswa) {
      return siswa.data_siswa?.keluarga?.filter(
        (kel: any) => kel.hubungan === "Ayah",
      )[0];
    }

    return null;
  }, [siswa]);

  const dataIbu = useMemo(() => {
    if (siswa) {
      return siswa.data_siswa?.keluarga?.filter(
        (kel: any) => kel.hubungan === "Ibu",
      )[0];
    }

    return null;
  }, [siswa]);

  useEffect(() => {
    if (siswa) {
      generateImage();
    }
  }, [pdfRef, siswa]);

  return (
    <>
      <Head>
        <title>Siswa | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Detail Calon Siswa
        </Title>

        <div className="flex justify-between">
          <Breadcrumb />

          <Button
            onClick={() => router.back()}
            className="!bg-gray-200"
            icon={<ChevronLeftIcon />}
            type="text"
          >
            Kembali
          </Button>
        </div>

        {isLoadingDetail ? (
          <div className="flex justify-center py-10">
            <Spin />
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="flex justify-between">
              <p className="font-bold text-2xl">Informasi Calon Siswa</p>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const pdf = new jsPDF("portrait", "mm", "a4");
                    const imgWidth = 210;
                    const imgHeight = 297;
                    pdf.addImage(
                      imageData,
                      "PNG",
                      0,
                      0,
                      imgWidth,
                      imgHeight,
                      undefined,
                      "FAST",
                    );
                    pdf.save(
                      `${siswa?.data_siswa?.nama}-${siswa?.data_siswa?.nik}.pdf`,
                    );
                  }}
                  icon={<DownloadIcon className="text-white" />}
                  type="primary"
                >
                  Download
                </Button>
              </div>
            </div>
            <div
              ref={pdfRef}
              className="space-y-5 text-sm border bg-white shadow-lg rounded-lg p-5"
            >
              <div className="space-y-3">
                <div className="bg-blue-500 text-center text-white !mt-0">
                  DATA CALON SISWA
                </div>

                <div className="flex justify-between items-center text-xs gap-4">
                  <div className="basis-9/12 space-y-1">
                    <div className="flex gap-3">
                      <p className="w-[150px]">Nama Lengkap</p>
                      <p>: {siswa?.data_siswa?.nama}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">Tempat Tanggal Lahir</p>
                      <p>
                        : {siswa?.data_siswa?.tempat_lahir},{" "}
                        {moment(siswa?.tanggal_lahir).format("DD/MM/YYYY")}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">NIK</p>
                      <p>: {siswa?.data_siswa?.nik}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">Jenis Kelamin</p>
                      <p>: {siswa?.data_siswa?.jenis_kelamin || "-"}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">Tinggi Badan</p>
                      <p>: {siswa?.data_siswa?.tinggi_badan} cm</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">Berat Badan</p>
                      <p>: {siswa?.data_siswa?.berat_badan} kg</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">Lingkar Kepala</p>
                      <p>: {siswa?.data_siswa?.lingkar_kepala} cm</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">Golongan Darah</p>
                      <p>: {siswa?.data_siswa?.gol_darah}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">Agama</p>
                      <p>: {siswa?.data_siswa?.agama}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">Suku</p>
                      <p>: {siswa?.data_siswa?.suku}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">Kewarganegaraan</p>
                      <p>: {siswa?.data_siswa?.kewarganegaraan}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px] flex-shrink-0">Alamat Rumah</p>
                      <p>: {siswa?.data_siswa?.alamat}</p>
                      <div className="flex gap-3"></div>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px] flex-shrink-0">Telepon Rumah</p>
                      <p>: {siswa?.data_siswa?.telp_rumah || "-"}</p>
                    </div>
                  </div>
                  <div className="basis-3/12 flex flex-col items-center gap-3">
                    <Image
                      src={siswa?.data_siswa?.avatar || ""}
                      width={500}
                      height={500}
                      className="w-[100px]"
                      alt="Siswa"
                    />
                    {siswa?.data_siswa?.avatar && (
                      <Button size="small" onClick={downloadImage}>
                        Download Gambar
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-blue-500 text-center text-white">
                  DATA SEKOLAH
                </div>
                <div className="flex justify-between text-xs gap-4">
                  <div className="w-full space-y-1">
                    <div className="flex gap-3">
                      <p className="w-[150px] flex-shrink-0">Asal Sekolah</p>
                      <p>: {siswa?.data_siswa?.lulusan_dari || "-"}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px] flex-shrink-0">Tahun Lulus</p>
                      <p>: {siswa?.data_siswa?.tahun_lulus_asal || "-"}</p>
                    </div>
                  </div>
                  <div className="w-full space-y-1">
                    <div className="flex gap-3">
                      <p className="w-[150px] flex-shrink-0">NPSN</p>
                      <p>: {siswa?.data_siswa?.npsn_asal || "-"}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px] flex-shrink-0">Alamat</p>
                      <p>: {siswa?.data_siswa?.alamat_sekolah_asal || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-blue-500 text-center text-white">
                  DATA KELUARGA
                </div>
                <div className="text-xs space-y-3">
                  <div>
                    <p className="pb-4">
                      Anak ke {siswa?.data_siswa?.anak_ke} dari{" "}
                      {siswa?.data_siswa?.jumlah_saudara} bersaudara
                    </p>
                    <table className="min-w-full border text-xs border-gray-200 rounded-lg">
                      {/* Header */}
                      <thead className="bg-gray-100">
                        <tr className="pb-2">
                          <th className="px-4 py-1 border !pb-2 text-left">
                            Nama
                          </th>
                          <th className="px-4 py-1 border !pb-2 text-left">
                            Jenis Kelamin
                          </th>
                          <th className="px-4 py-1 border !pb-2 text-left">
                            Pendidikan
                          </th>
                        </tr>
                      </thead>

                      {/* Body */}
                      <tbody>
                        {(siswa?.data_siswa?.keluarga?.length as number) > 0 ? (
                          siswa?.data_siswa?.keluarga
                            ?.filter(
                              (kel: any) =>
                                kel?.hubungan !== "Ibu" &&
                                kel?.hubungan !== "Ayah",
                            )
                            .map((item: any, index: number) => (
                              <tr
                                key={index}
                                className="border-b hover:bg-gray-50 pb-2"
                              >
                                <td className="px-4 py-1 border pb-2">
                                  {item.nama}
                                </td>
                                <td className="px-4 py-1 border pb-2">
                                  {item?.jenis_kelamin}
                                </td>
                                <td className="px-4 py-1 border pb-2">
                                  {item.pendidikan}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td
                              colSpan={3}
                              className="text-center py-4 text-gray-500"
                            >
                              Tidak ada data
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <table className="min-w-full border text-xs border-gray-200 rounded-lg">
                    {/* Header */}
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-1 border text-left">
                          Identitas
                        </th>
                        <th className="px-4 py-1 border text-left">Ayah</th>
                        <th className="px-4 py-1 border text-left">Ibu</th>
                      </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border">Nama</td>
                        <td className="px-4 py-1 border">{dataAyah?.nama}</td>
                        <td className="px-4 py-1 border">{dataIbu?.nama}</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border">Tanggal Lahir</td>
                        <td className="px-4 py-1 border">
                          {moment(dataAyah?.tanggal_lahir).format("DD/MM/YYYY")}
                        </td>
                        <td className="px-4 py-1 border">
                          {moment(dataIbu?.tanggal_lahir).format("DD/MM/YYYY")}
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border">NIK</td>
                        <td className="px-4 py-1 border">{dataAyah?.nik}</td>
                        <td className="px-4 py-1 border">{dataIbu?.nik}</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border">Agama</td>
                        <td className="px-4 py-1 border">{dataAyah?.agama}</td>
                        <td className="px-4 py-1 border">{dataIbu?.agama}</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border">Suku</td>
                        <td className="px-4 py-1 border">{dataAyah?.suku}</td>
                        <td className="px-4 py-1 border">{dataIbu?.suku}</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border">Pendidikan</td>
                        <td className="px-4 py-1 border">
                          {dataAyah?.pendidikan}
                        </td>
                        <td className="px-4 py-1 border">
                          {dataIbu?.pendidikan}
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border">Pekerjaan</td>
                        <td className="px-4 py-1 border">
                          {dataAyah?.pekerjaan}
                        </td>
                        <td className="px-4 py-1 border">
                          {dataIbu?.pekerjaan}
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border">Alamat</td>
                        <td className="px-4 py-1 border">{dataAyah?.alamat}</td>
                        <td className="px-4 py-1 border">{dataIbu?.alamat}</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border">
                          Penghasilan per bulan
                        </td>
                        <td className="px-4 py-1 border">
                          {formatCurrency(dataAyah?.gaji)}
                        </td>
                        <td className="px-4 py-1 border">
                          {formatCurrency(dataIbu?.gaji)}
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border">Email</td>
                        <td className="px-4 py-1 border">{dataAyah?.email}</td>
                        <td className="px-4 py-1 border">{dataIbu?.email}</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border">No. HP</td>
                        <td className="px-4 py-1 border">{dataAyah?.no_hp}</td>
                        <td className="px-4 py-1 border">{dataIbu?.no_hp}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div
              ref={pdfRef}
              className="max-w-[800px] hidden space-y-5 text-sm border bg-white shadow-lg rounded-lg aspect-[21/29.7] p-5"
            >
              <div className="space-y-3">
                <div className="bg-blue-500 text-center text-white !mt-0 pb-3">
                  DATA CALON SISWA
                </div>

                <div className="flex justify-between items-center text-xs gap-4">
                  <div className="basis-9/12 space-y-1">
                    <div className="flex gap-3">
                      <p className="w-[150px]">Nama Lengkap</p>
                      <p>: {siswa?.data_siswa?.nama}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">Tempat Tanggal Lahir</p>
                      <p>
                        : {siswa?.data_siswa?.tempat_lahir},{" "}
                        {moment(siswa?.tanggal_lahir).format("DD/MM/YYYY")}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">NIK</p>
                      <p>: {siswa?.data_siswa?.nik}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">Jenis Kelamin</p>
                      <p>: {siswa?.data_siswa?.jenis_kelamin || "-"}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">Tinggi Badan</p>
                      <p>: {siswa?.data_siswa?.tinggi_badan} cm</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">Berat Badan</p>
                      <p>: {siswa?.data_siswa?.berat_badan} kg</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">Lingkar Kepala</p>
                      <p>: {siswa?.data_siswa?.lingkar_kepala} cm</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">Golongan Darah</p>
                      <p>: {siswa?.data_siswa?.gol_darah}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">Agama</p>
                      <p>: {siswa?.data_siswa?.agama}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">Suku</p>
                      <p>: {siswa?.data_siswa?.suku}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px]">Kewarganegaraan</p>
                      <p>: {siswa?.data_siswa?.kewarganegaraan}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px] flex-shrink-0">Alamat Rumah</p>
                      <p>: {siswa?.data_siswa?.alamat}</p>
                      <div className="flex gap-3"></div>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px] flex-shrink-0">Telepon Rumah</p>
                      <p>: {siswa?.data_siswa?.telp_rumah || "-"}</p>
                    </div>
                  </div>
                  <div className="basis-3/12 flex flex-col items-center">
                    <Image
                      src={siswa?.data_siswa?.avatar || ""}
                      width={500}
                      height={500}
                      className="w-[100px]"
                      alt="Siswa"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-blue-500 text-center text-white pb-3">
                  DATA SEKOLAH
                </div>
                <div className="flex justify-between text-xs gap-4">
                  <div className="w-full space-y-1">
                    <div className="flex gap-3">
                      <p className="w-[150px] flex-shrink-0">Asal Sekolah</p>
                      <p>: {siswa?.data_siswa?.lulusan_dari || "-"}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px] flex-shrink-0">Tahun Lulus</p>
                      <p>: {siswa?.data_siswa?.tahun_lulus_asal || "-"}</p>
                    </div>
                  </div>
                  <div className="w-full space-y-1">
                    <div className="flex gap-3">
                      <p className="w-[150px] flex-shrink-0">NPSN</p>
                      <p>: {siswa?.data_siswa?.npsn_asal || "-"}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="w-[150px] flex-shrink-0">Alamat</p>
                      <p>: {siswa?.data_siswa?.alamat_sekolah_asal || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-blue-500 text-center text-white pb-3">
                  DATA KELUARGA
                </div>
                <div className="text-xs space-y-3">
                  <div>
                    <p className="pb-4">
                      Anak ke {siswa?.data_siswa?.anak_ke} dari{" "}
                      {siswa?.data_siswa?.jumlah_saudara} bersaudara
                    </p>
                    <table className="min-w-full border text-xs border-gray-200 rounded-lg">
                      {/* Header */}
                      <thead className="bg-gray-100">
                        <tr className="!pb-4">
                          <th className="px-4 py-1 border !pb-4 text-left">
                            Nama
                          </th>
                          <th className="px-4 py-1 border !pb-4 text-left">
                            Jenis Kelamin
                          </th>
                          <th className="px-4 py-1 border !pb-4 text-left">
                            Pendidikan
                          </th>
                        </tr>
                      </thead>

                      {/* Body */}
                      <tbody>
                        {(siswa?.data_siswa?.keluarga?.length as number) > 0 ? (
                          siswa?.data_siswa?.keluarga
                            ?.filter(
                              (kel: any) =>
                                kel?.hubungan !== "Ibu" &&
                                kel?.hubungan !== "Ayah",
                            )
                            .map((item: any, index: number) => (
                              <tr
                                key={index}
                                className="border-b hover:bg-gray-50 !pb-6"
                              >
                                <td className="px-4 py-1 border !pb-4">
                                  {item?.nama}
                                </td>
                                <td className="px-4 py-1 border !pb-4">
                                  {item?.jenis_kelamin}
                                </td>
                                <td className="px-4 py-1 border !pb-4">
                                  {item?.pendidikan}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td
                              colSpan={3}
                              className="text-center py-4 text-gray-500"
                            >
                              Tidak ada data
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <table className="min-w-full border text-xs border-gray-200 rounded-lg">
                    {/* Header */}
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-1 border text-left !pb-4">
                          Identitas
                        </th>
                        <th className="px-4 py-1 border text-left !pb-4">
                          Ayah
                        </th>
                        <th className="px-4 py-1 border text-left !pb-4">
                          Ibu
                        </th>
                      </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 !pb-4 border">Nama</td>
                        <td className="px-4 py-1 !pb-4 border">
                          {dataAyah?.nama}
                        </td>
                        <td className="px-4 py-1 !pb-4 border">
                          {dataIbu?.nama}
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border !pb-4">
                          Tanggal Lahir
                        </td>
                        <td className="px-4 py-1 border !pb-4">
                          {moment(dataAyah?.tanggal_lahir).format("DD/MM/YYYY")}
                        </td>
                        <td className="px-4 py-1 border !pb-4">
                          {moment(dataIbu?.tanggal_lahir).format("DD/MM/YYYY")}
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border !pb-4">NIK</td>
                        <td className="px-4 py-1 border !pb-4">
                          {dataAyah?.nik}
                        </td>
                        <td className="px-4 py-1 border !pb-4">
                          {dataIbu?.nik}
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border !pb-4">Agama</td>
                        <td className="px-4 py-1 border !pb-4">
                          {dataAyah?.agama}
                        </td>
                        <td className="px-4 py-1 border !pb-4">
                          {dataIbu?.agama}
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border !pb-4">Suku</td>
                        <td className="px-4 py-1 border !pb-4">
                          {dataAyah?.suku}
                        </td>
                        <td className="px-4 py-1 border !pb-4">
                          {dataIbu?.suku}
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border !pb-4">Pendidikan</td>
                        <td className="px-4 py-1 border !pb-4">
                          {dataAyah?.pendidikan}
                        </td>
                        <td className="px-4 py-1 border !pb-4">
                          {dataIbu?.pendidikan}
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border !pb-4">Pekerjaan</td>
                        <td className="px-4 py-1 border !pb-4">
                          {dataAyah?.pekerjaan}
                        </td>
                        <td className="px-4 py-1 border !pb-4">
                          {dataIbu?.pekerjaan}
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border !pb-4">Alamat</td>
                        <td className="px-4 py-1 border !pb-4">
                          {dataAyah?.alamat}
                        </td>
                        <td className="px-4 py-1 border !pb-4">
                          {dataIbu?.alamat}
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border !pb-4">
                          Penghasilan per bulan
                        </td>
                        <td className="px-4 py-1 border !pb-4">
                          {formatCurrency(dataAyah?.gaji)}
                        </td>
                        <td className="px-4 py-1 border !pb-4">
                          {formatCurrency(dataIbu?.gaji)}
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border !pb-4">Email</td>
                        <td className="px-4 py-1 border !pb-4">
                          {dataAyah?.email}
                        </td>
                        <td className="px-4 py-1 border !pb-4">
                          {dataIbu?.email}
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-1 border !pb-4">No. HP</td>
                        <td className="px-4 py-1 border !pb-4">
                          {dataAyah?.no_hp}
                        </td>
                        <td className="px-4 py-1 border !pb-4">
                          {dataIbu?.no_hp}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

DetailPPDB.withLayout = (page: ReactElement) => {
  return <AuthenticatedLayout activeLink="ppdb">{page}</AuthenticatedLayout>;
};
DetailPPDB.isProtected = true;

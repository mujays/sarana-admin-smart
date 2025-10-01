import { ReactElement, useState } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import Head from "next/head";
import classNames from "classnames";
import { Breadcrumb } from "@/features/navigation/components/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import KelasServices from "@/services/kelas";
import { Button, Input, Table, Typography } from "antd";
import { ChevronLeftIcon, SearchIcon } from "lucide-react";
import { Spin } from "@/components/spin";
import SiswaServices from "@/services/siswa";
import { useDebounce } from "@/hooks/useDebounce";
import { TableProps } from "antd/lib";
import { TSiswa } from "@/services/siswa/siswa.type";
import { Text } from "@/components/text";
import ManageKelas from "../components/ManageKelas";
import MoveKelas from "../components/MoveKelas";
import GraduateStudent from "../components/GraduateStudent";

export default function Kelas() {
  const { query, back, pathname } = useRouter();
  const kelasId: string = query.kelasId as string;
  const [selectedStudent, setSelectedStudent] = useState<number[]>([]);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("nama,asc");

  const paths = pathname.split("/");
  const type = paths[1];

  const debounceSearch = useDebounce(search, 300);

  const columns: TableProps<TSiswa>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama",
      dataIndex: "nama",
      sorter: true,
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value}</Text>
      ),
    },
    {
      title: "NIS",
      dataIndex: "nis",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value}</Text>
      ),
    },
    {
      title: "NISN",
      dataIndex: "nisn",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value}</Text>
      ),
    },
  ];

  const { data: kelas, isLoading } = useQuery({
    queryKey: ["CLASS", kelasId],
    enabled: !!kelasId,
    queryFn: async () => {
      const response = await KelasServices.getOne(+kelasId, {
        with: "siswa",
        count: "siswa",
      });
      return response;
    },
  });

  const { data: students, isLoading: isLoadingSiswa } = useQuery({
    enabled: !!kelas?.data?.id,
    queryKey: [
      "STUDENTS_CLASS",
      pagination.page,
      pagination.pageSize,
      kelas?.data.id,
      debounceSearch,
      type,
      sort,
    ],
    queryFn: async () => {
      const response = await SiswaServices.get({
        kelas: [kelas?.data?.id],
        ...(debounceSearch && { search: debounceSearch }),
        page_size: pagination.pageSize,
        page: pagination.page,
        with: "kelas",
        siswa_lama: true,
        type: type.toUpperCase(),
        order: sort.split(",")[0],
        by: sort.split(",")[1],
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((siswa, index) => ({
          ...siswa,
          no:
            index +
            1 +
            pagination.pageSize * pagination.page -
            pagination.pageSize,
          key: index,
        })),
      };
    },
  });

  const clearStudent = () => {
    setSelectedStudent([]);
  };

  const filteredSiswa = [
    ...selectedStudent,
    ...(kelas?.data.siswa.map((s) => s.id) || []),
  ];

  const notRemovedSiswa = filteredSiswa.filter(
    (item) => filteredSiswa.indexOf(item) === filteredSiswa.lastIndexOf(item),
  );

  return (
    <>
      <Head>
        <title>Kelas | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Detail Kelas
        </Title>

        <div className="flex justify-between">
          <Breadcrumb />

          <Button
            onClick={() => back()}
            className="!bg-gray-200"
            icon={<ChevronLeftIcon />}
            type="text"
          >
            Kembali
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spin />
          </div>
        ) : (
          <div className="p-5 space-y-3 border rounded">
            <div className="flex justify-between">
              <p className="text-xl font-semibold">{kelas?.data.nama || "-"}</p>
              <ManageKelas siswa={kelas?.data.siswa || []} kelasId={+kelasId} />
            </div>

            <div className="grid grid-cols-2">
              <div className="space-y-1">
                <p>Jumlah Siswa</p>
                <p className="font-semibold text-lg">
                  {kelas?.data.siswa_count}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p>Deskripsi</p>
              <p className="text-lg">{kelas?.data.description}</p>
            </div>

            <div className={classNames("flex justify-between")}>
              <div className="flex items-center gap-3">
                {selectedStudent.length ? (
                  <MoveKelas
                    clear={clearStudent}
                    siswaIds={selectedStudent}
                    siswaNotRemoved={notRemovedSiswa}
                  />
                ) : null}

                {kelas?.data.tingkatan_id === 6 ||
                kelas?.data.tingkatan_id === 9 ? (
                  <GraduateStudent
                    clear={clearStudent}
                    siswaInClass={kelas.data.siswa.map((s) => s.id)}
                  />
                ) : null}
              </div>

              <Input
                style={{
                  width: 280,
                }}
                placeholder="Search Nama, NIS atau NISN"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                prefix={<SearchIcon className="text-gray-300" />}
              />
            </div>

            <div className="overflow-auto ">
              <Table<TSiswa>
                id="siswa-table"
                rowSelection={{
                  selectedRowKeys: selectedStudent,
                  onChange(selectedRowKeys) {
                    setSelectedStudent(selectedRowKeys as any);
                  },
                }}
                rowKey={(obj) => obj.id}
                columns={columns}
                dataSource={students?.data}
                loading={isLoadingSiswa}
                pagination={{
                  onChange: (page, pageSize) => {
                    setPagination({ page, pageSize });
                  },
                  total: students?.meta.total,
                  pageSize: pagination.pageSize,
                  current: pagination.page,
                  pageSizeOptions: [10, 20, 50],
                  showSizeChanger: true,
                }}
                onChange={(pagination, filters, sorter, extra) => {
                  if (!Array.isArray(sorter)) {
                    if (sorter.column) {
                      let dataIndex = sorter.column.dataIndex as string;
                      const sort = `${
                        sorter.order === "ascend"
                          ? `${dataIndex},asc`
                          : `${dataIndex},desc`
                      }`;
                      setSort(sort);
                    } else {
                      setSort("nama,asc");
                    }
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

Kelas.withLayout = (page: ReactElement) => {
  return <AuthenticatedLayout activeLink="kelas">{page}</AuthenticatedLayout>;
};
Kelas.isProtected = true;

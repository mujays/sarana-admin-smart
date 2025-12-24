import { ReactElement, useState } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Dropdown,
  Pagination,
  Row,
  Col,
  Typography,
} from "antd";
import {
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { SearchIcon } from "lucide-react";
import type { TableProps, MenuProps } from "antd";
import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import { useListSemester } from "./hooks/useListSemester";
import { AddSemester } from "./components/AddSemester";
import { EditSemester } from "./components/EditSemester";
import { DeleteSemester } from "./components/DeleteSemester";
import { DetailSemester } from "./components/DetailSemester";
import { TSemester } from "@/services/akademik/akademik.type";
import { useDebounce } from "@/hooks/useDebounce";
import dayjs from "dayjs";
import Head from "next/head";

const { Title } = Typography;

export default function SemesterPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const debounceSearch = useDebounce(search, 300);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<TSemester | null>(
    null,
  );

  const { data, isLoading, error } = useListSemester({
    page,
    page_size: pageSize,
    search: debounceSearch || undefined,
  });

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD MMMM YYYY");
  };

  const getSemesterTypeName = (nomor: number) => {
    return nomor === 1 ? "Ganjil" : "Genap";
  };

  const getMenuItems = (record: TSemester): MenuProps["items"] => [
    {
      key: "detail",
      label: "Detail",
      icon: <EyeOutlined />,
      onClick: () => {
        setSelectedSemester(record);
        setShowDetailModal(true);
      },
    },
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
      onClick: () => {
        setSelectedSemester(record);
        setShowEditModal(true);
      },
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: "Hapus",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        setSelectedSemester(record);
        setShowDeleteModal(true);
      },
    },
  ];

  const columns: TableProps<TSemester>["columns"] = [
    {
      title: "No",
      key: "index",
      width: 60,
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "Nama Semester",
      dataIndex: "nama",
      key: "nama",
      sorter: true,
    },
    {
      title: "Nomor",
      dataIndex: "nomor",
      key: "nomor",
      width: 120,
      render: (nomor: number) => (
        <Tag color={nomor === 1 ? "blue" : "green"}>
          {nomor} ({getSemesterTypeName(nomor)})
        </Tag>
      ),
    },
    {
      title: "Tanggal Mulai",
      dataIndex: "tanggal_mulai",
      key: "tanggal_mulai",
      width: 130,
      render: (date: string) => formatDate(date),
    },
    {
      title: "Tanggal Akhir",
      dataIndex: "tanggal_akhir",
      key: "tanggal_akhir",
      width: 130,
      render: (date: string) => formatDate(date),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? "success" : "error"}>
          {isActive ? "Aktif" : "Tidak Aktif"}
        </Tag>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{ items: getMenuItems(record) }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowDetailModal(false);
    setSelectedSemester(null);
  };

  return (
    <>
      <Head>
        <title>Semester | Smart School</title>
      </Head>

      <div className="p-6">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <div className="flex justify-between items-center mb-6">
                <Title level={2} className="!mb-0">
                  Manajemen Semester
                </Title>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setShowAddModal(true)}
                >
                  Tambah Semester
                </Button>
              </div>

              <div className="mb-4">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Input
                      placeholder="Cari semester..."
                      prefix={<SearchIcon className="h-4 w-4" />}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      allowClear
                    />
                  </Col>
                </Row>
              </div>

              <Table
                columns={columns}
                dataSource={data?.data || []}
                rowKey="id"
                loading={isLoading}
                pagination={false}
                onChange={handleTableChange}
                scroll={{ x: 800 }}
                size="middle"
              />

              {data && (
                <div className="flex justify-end items-center mt-4">
                  <Pagination
                    current={page}
                    pageSize={pageSize}
                    total={data?.meta?.total}
                    showSizeChanger
                    showQuickJumper
                    onChange={(newPage, newPageSize) => {
                      setPage(newPage);
                      setPageSize(newPageSize || pageSize);
                    }}
                    onShowSizeChange={(_, size) => {
                      setPageSize(size);
                      setPage(1);
                    }}
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} dari ${total} semester`
                    }
                  />
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Modals */}
        <AddSemester open={showAddModal} onClose={handleCloseModals} />

        <EditSemester
          open={showEditModal}
          onClose={handleCloseModals}
          semesterId={selectedSemester?.id || null}
        />

        <DeleteSemester
          open={showDeleteModal}
          onClose={handleCloseModals}
          semester={selectedSemester}
        />

        <DetailSemester
          open={showDetailModal}
          onClose={handleCloseModals}
          semesterId={selectedSemester?.id || null}
        />
      </div>
    </>
  );
}

SemesterPage.withLayout = (page: ReactElement) => {
  return (
    <AuthenticatedLayout activeLink="semester">{page}</AuthenticatedLayout>
  );
};
SemesterPage.isProtected = true;

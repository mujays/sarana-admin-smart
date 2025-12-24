import { ReactElement, useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Card,
  Select,
  Button,
  Row,
  Col,
  Typography,
  message,
  Spin,
  Badge,
  Divider,
  Space,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  BookOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import AkademikService from "@/services/akademik";
import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import { TRaport } from "@/services/akademik/akademik.type";
import Head from "next/head";
import { AddRaport, EditRaport } from "./components";
import SiswaServices from "@/services/siswa";

const { Title, Text } = Typography;
const { Option } = Select;

function RaportDetail() {
  const router = useRouter();
  const { siswaId } = router.query;

  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRaport, setEditingRaport] = useState<TRaport | undefined>(
    undefined,
  );

  const { data: siswa, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["STUDENT", router.query?.siswaId],
    enabled: !!siswaId,
    queryFn: async () => {
      const response = await SiswaServices.getOne(+(siswaId as string), {
        with: "kelas",
      });
      return response.data;
    },
  });

  // Get semester list
  const { data: semesterList, isLoading: isLoadingSemesters } = useQuery({
    queryKey: ["LIST_SEMESTER_ALL"],
    queryFn: async () => {
      const response = await AkademikService.getSemester({ page_size: 100 });
      return response;
    },
  });

  // Get mata pelajaran list for add form
  const { data: mapelList, isLoading: isLoadingMapel } = useQuery({
    queryKey: ["LIST_MAPEL_ALL"],
    queryFn: async () => {
      const response = await AkademikService.getMapel({ page_size: 100 });
      return response;
    },
  });

  // Get raport data
  const {
    data: raportData,
    isLoading: isLoadingRaport,
    refetch,
  } = useQuery({
    queryKey: ["RAPORT_DETAIL", siswaId, selectedSemester],
    queryFn: async () => {
      if (siswaId && selectedSemester) {
        const response = await AkademikService.getRaport(
          parseInt(siswaId as string),
          selectedSemester,
        );
        return response;
      }
      return null;
    },
    enabled: !!siswaId && !!selectedSemester,
  });

  // Set default semester (first one)
  useEffect(() => {
    if (
      semesterList?.data &&
      semesterList.data.length > 0 &&
      !selectedSemester
    ) {
      setSelectedSemester(semesterList.data[0].id);
    }
  }, [semesterList, selectedSemester]);

  const handleSemesterChange = (value: number) => {
    setSelectedSemester(value);
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    refetch();
  };

  const handleEditRaport = (raport: TRaport) => {
    setEditingRaport(raport);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingRaport(undefined);
    refetch();
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setEditingRaport(undefined);
  };

  const getGradeColor = (nilai: number) => {
    if (nilai >= 90) return "success";
    if (nilai >= 80) return "processing";
    if (nilai >= 70) return "warning";
    return "error";
  };

  const getGradeLetter = (nilai: number) => {
    if (nilai >= 90) return "A";
    if (nilai >= 80) return "B";
    if (nilai >= 70) return "C";
    if (nilai >= 60) return "D";
    return "E";
  };

  const availableMapel = mapelList?.data?.data?.filter(
    (mapel) =>
      !raportData?.data?.some(
        (raport) => raport.mata_pelajaran_id === mapel.id,
      ),
  );

  return (
    <>
      <Head>
        <title>Detail Raport Siswa | Smart School</title>
      </Head>

      <div className="p-6">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <div>
              <Title level={2} className="!mb-2">
                <BookOutlined className="mr-2" />
                Raport Siswa
              </Title>
              <Text type="secondary">
                <UserOutlined className="mr-1" />
                Nama Siswa: {siswa?.nama || ""}
              </Text>
            </div>
            <Space>
              <Select
                value={selectedSemester}
                onChange={handleSemesterChange}
                loading={isLoadingSemesters}
                style={{ width: 200 }}
                placeholder="Pilih Semester"
              >
                {semesterList?.data?.map((semester) => (
                  <Option key={semester.id} value={semester.id}>
                    {semester.nama}
                  </Option>
                ))}
              </Select>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() =>
                  router.push(
                    `/akademik/raport/${siswaId}/manage-raport/add-raport`,
                  )
                }
                disabled={!selectedSemester}
              >
                Tambah Nilai
              </Button>
            </Space>
          </div>

          <Divider />

          {isLoadingRaport ? (
            <div className="flex justify-center py-8">
              <Spin size="large" tip="Memuat data raport..." />
            </div>
          ) : (
            <div className="space-y-4">
              {raportData?.data && raportData.data.length > 0 ? (
                raportData.data.map((raport, index) => (
                  <Card
                    key={raport.id}
                    className="shadow-sm hover:shadow-md transition-shadow"
                    size="small"
                  >
                    <Row gutter={[16, 16]} align="middle">
                      <Col xs={24} sm={2}>
                        <div className="text-center">
                          <Badge
                            count={index + 1}
                            style={{ backgroundColor: "#1890ff" }}
                            size="default"
                          />
                        </div>
                      </Col>

                      <Col xs={24} sm={6}>
                        <div>
                          <Text strong className="block">
                            {raport.mata_pelajaran.nama}
                          </Text>
                          <Text type="secondary" className="text-sm">
                            Kode: {raport.mata_pelajaran.kode}
                          </Text>
                        </div>
                      </Col>

                      <Col xs={24} sm={4}>
                        <div className="text-center">
                          <Badge
                            color={getGradeColor(raport.nilai_angka)}
                            text={
                              <span className="font-bold text-lg">
                                {raport.nilai_angka}
                              </span>
                            }
                          />
                          <div className="text-sm text-gray-500">
                            Grade: {getGradeLetter(raport.nilai_angka)}
                          </div>
                        </div>
                      </Col>

                      <Col xs={24} sm={8}>
                        <div>
                          <Text type="secondary" className="text-sm block mb-1">
                            Catatan:
                          </Text>
                          <Text className="text-sm">
                            {raport.catatan || "-"}
                          </Text>
                        </div>
                      </Col>

                      <Col xs={24} sm={4}>
                        <div className="flex justify-end">
                          <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => handleEditRaport(raport)}
                            size="small"
                          >
                            Edit
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOutlined className="text-4xl text-gray-300 mb-4" />
                  <Text type="secondary">
                    Belum ada data raport untuk semester ini
                  </Text>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Edit Raport Modal */}
        <EditRaport
          visible={showEditModal}
          onCancel={handleEditCancel}
          onSuccess={handleEditSuccess}
          raportData={editingRaport}
        />
      </div>
    </>
  );
}

RaportDetail.withLayout = (page: ReactElement) => {
  return <AuthenticatedLayout activeLink="raport">{page}</AuthenticatedLayout>;
};
RaportDetail.isProtected = true;

export default RaportDetail;

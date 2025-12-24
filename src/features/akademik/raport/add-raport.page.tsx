import { ReactElement, useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Card,
  Select,
  Button,
  Typography,
  Spin,
  Space,
  Row,
  Col,
  Divider,
  Steps,
  Result,
} from "antd";
import {
  BookOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import AkademikService from "@/services/akademik";
import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import Head from "next/head";
import { AddRaport } from "./components";
import SiswaServices from "@/services/siswa";

const { Title, Text } = Typography;
const { Option } = Select;

function AddRaportPage() {
  const router = useRouter();
  const { siswaId } = router.query;

  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

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

  // Get existing raport data to filter available subjects
  const { data: existingRaport } = useQuery({
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

  // Progress to next step when semester is selected
  useEffect(() => {
    if (selectedSemester && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [selectedSemester, currentStep]);

  const handleSemesterChange = (value: number) => {
    setSelectedSemester(value);
  };

  const handleSuccess = () => {
    setIsSuccess(true);
    setCurrentStep(2);
  };

  const handleBackToList = () => {
    router.back();
  };

  if (!siswaId) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  const availableMapel = mapelList?.data?.data?.filter(
    (mapel) =>
      !existingRaport?.data?.some(
        (raport) => raport.mata_pelajaran_id === mapel.id,
      ),
  );

  return (
    <>
      <Head>
        <title>Tambah Raport Siswa | Smart School</title>
      </Head>

      <div className="p-6">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <div>
              <Title level={2} className="!mb-2">
                <BookOutlined className="mr-2" />
                Tambah Nilai Raport
              </Title>
              <Text type="secondary">
                <UserOutlined className="mr-1" />
                Siswa: {siswa?.nama || ""}
              </Text>
            </div>
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={handleBackToList}
            >
              Kembali ke Daftar Raport
            </Button>
          </div>

          <Divider />

          <div className="space-y-6">
            <Card size="small" className="bg-blue-50 border-blue-200">
              <Row gutter={16} align="middle">
                <Col xs={24} md={6}>
                  <Text strong>Pilih Semester:</Text>
                </Col>
                <Col xs={24} md={12}>
                  <Select
                    value={selectedSemester}
                    onChange={handleSemesterChange}
                    loading={isLoadingSemesters}
                    style={{ width: "100%" }}
                    placeholder="Pilih Semester"
                    size="large"
                  >
                    {semesterList?.data?.map((semester) => (
                      <Option key={semester.id} value={semester.id}>
                        {semester.nama}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} md={6}>
                  <Text type="secondary" className="text-sm">
                    {availableMapel?.length || 0} mata pelajaran tersedia
                  </Text>
                </Col>
              </Row>
            </Card>

            {selectedSemester && !isSuccess && (
              <AddRaport
                visible={true}
                onCancel={() => {}}
                kelasId={siswa?.kelas?.[0]?.id || 0}
                onSuccess={handleSuccess}
                siswaId={parseInt(siswaId as string)}
                semesterId={selectedSemester}
                availableMapel={availableMapel}
                isLoadingMapel={isLoadingMapel}
                isPage={true}
              />
            )}
          </div>

          {isSuccess && (
            <Result
              status="success"
              title="Nilai Raport Berhasil Ditambahkan!"
              subTitle={`Nilai untuk siswa ${
                siswa?.nama || ""
              } pada semester yang dipilih telah berhasil disimpan.`}
              extra={[
                <Button type="primary" key="back" onClick={handleBackToList}>
                  Lihat Daftar Raport
                </Button>,
              ]}
            />
          )}
        </Card>
      </div>
    </>
  );
}

AddRaportPage.withLayout = (page: ReactElement) => {
  return <AuthenticatedLayout activeLink="raport">{page}</AuthenticatedLayout>;
};
AddRaportPage.isProtected = true;

export default AddRaportPage;

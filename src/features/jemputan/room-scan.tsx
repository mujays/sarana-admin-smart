import { useDebounce } from "@/hooks/useDebounce";
import { useDisclosure } from "@/hooks/useDisclosure";
import JemputanServices from "@/services/jemputan";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Typography } from "antd";
import { CircleX, Loader2Icon, QrCodeIcon, ScanQrCodeIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function RoomScan() {
  const modal = useDisclosure();
  const router = useRouter();
  const [scannedData, setScannedData] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorScan, setErrorScan] = useState(false);
  const code = useDebounce(scannedData, 300);
  const paths = router.pathname.split("/");
  const type = paths[1];
  const queryClient = useQueryClient();

  const inputRef: any = useRef();

  const processCode = async (code: string) => {
    try {
      setLoading(true);
      setErrorScan(false);
      const response = await JemputanServices.check(code);
      queryClient.invalidateQueries({ queryKey: ["PICKUP"] });
      toast.success("Scan berhasil!");
      return response;
    } catch (error) {
      setErrorScan(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modal.isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modal]);

  useEffect(() => {
    if (code) {
      processCode(code);
      setScannedData("");
    }
  }, [code]);

  return (
    <>
      <Button
        onClick={() => modal.onOpen()}
        icon={<QrCodeIcon className="w-4 h-4" />}
        type="primary"
      >
        <span className="!hidden md:!inline">Scan Jemputan</span>
      </Button>
      <Modal
        footer={false}
        open={modal.isOpen}
        onCancel={() => {
          modal.onClose();
          setErrorScan(false);
          setScannedData("");
        }}
        title={<Typography.Title level={4}>Scan Jemputan</Typography.Title>}
      >
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2Icon className="animate-spin w-8 h-8" />
          </div>
        ) : errorScan ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <CircleX className="text-red-500 w-8 h-8" />
            <p>QR Code sudah kedaluwarsa atau tidak ditemukan</p>
          </div>
        ) : (
          <div className="flex justify-center items-center flex-col gap-4 pt-10">
            <ScanQrCodeIcon className="w-10 h-10" />
            <p>Silahkan scan QR Code</p>
          </div>
        )}

        <input
          ref={inputRef as any}
          value={scannedData}
          type="text"
          autoFocus
          onChange={(e) => {
            if (modal.isOpen) {
              setScannedData(e.target.value);
            }
          }}
          className="opacity-0 cursor-default"
          onBlur={() => inputRef.current?.focus()}
        />
      </Modal>
    </>
  );
}

export default RoomScan;

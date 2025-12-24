import { useQuery } from "@tanstack/react-query";
import AkademikService from "@/services/akademik";

interface UseListSemesterProps {
  page?: number;
  page_size?: number;
  search?: string;
}

export const useListSemester = (params?: UseListSemesterProps) => {
  return useQuery({
    queryKey: ["LIST_SEMESTER", params],
    queryFn: async () => {
      const response = await AkademikService.getSemester(params);
      return response;
    },
  });
};

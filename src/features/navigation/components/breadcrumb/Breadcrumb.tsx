import { Text } from "@/components/text";
import { DashboardIcon } from "@/components/icons";
import { useRouter } from "next/router";
import { BreadcrumbProps } from "antd";
import { ROUTE_MAP } from "../../constants";
import { Breadcrumb as _Breadcrumb } from "@/components/breadcrumb";

export const Breadcrumb = ({
  items: overrideItems,
  isAcademic = true,
}: {
  items?: BreadcrumbProps["items"];
  isAcademic?: boolean;
}) => {
  const router = useRouter();
  const paths = router.pathname.split("/");

  paths.shift();
  let items = [];
  if (overrideItems) {
    items = overrideItems;
  } else {
    items = paths
      .filter((path) => (ROUTE_MAP[path] ? true : false))
      .map((path) => ({
        title: ROUTE_MAP[path],
      }));
  }

  return (
    <_Breadcrumb
      style={{
        marginBottom: "24px",
      }}
      items={[
        {
          className: "!flex !items-center !gap-[4px] !text-blue-500 !pr-[0px]",
          href: isAcademic ? `/${paths[0]}/${paths[1]}` : `/${paths[0]}`,
          title: (
            <>
              <DashboardIcon fill="#0d69b2" />
              <Text className="!text-blue-500">{ROUTE_MAP["dashboard"]}</Text>
            </>
          ),
        },
        ...items,
      ]}
    />
  );
};

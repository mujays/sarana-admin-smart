import {
  BreadcrumbProps,
  ConfigProvider,
  Breadcrumb as _Breadcrumb,
} from "antd";

type TBreadcrumb = Pick<BreadcrumbProps, "items" | "className" | "style">;

export const Breadcrumb = (props: TBreadcrumb) => {
  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        components: {
          Breadcrumb: {
            itemColor: "var(--tcs-neutral-05)",
            separatorMargin: 4,
          },
        },
      }}
    >
      <_Breadcrumb {...props} />
    </ConfigProvider>
  );
};

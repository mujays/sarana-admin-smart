import { WithStyle } from "@/types/styles";
import { ConfigProvider, DropdownProps, Dropdown as _Dropdown } from "antd";
import { MenuItemType } from "antd/es/menu/interface";

export const Dropdown = (props: WithStyle<DropdownProps>) => {
  // @ts-ignore
  props.menu?.items?.forEach((menuItem: MenuItemType) => {
    if (menuItem.danger) {
      menuItem["onMouseEnter"] = (info) => {
        const target = info.domEvent.currentTarget;
        target.style.backgroundColor = "#D820201A";
        target.style.color = "var(--danger)";
      };

      menuItem["onMouseLeave"] = (info) => {
        const target = info.domEvent.currentTarget;
        target.style.backgroundColor = "var(--white)";
        target.style.color = "var(--danger)";
      };
    } else {
      menuItem["onMouseEnter"] = (info) => {
        const target = info.domEvent.currentTarget;
        target.style.backgroundColor = "var(--primary-500)";
      };

      menuItem["onMouseLeave"] = (info) => {
        const target = info.domEvent.currentTarget;
        target.style.backgroundColor = "var(--white)";
      };
    }
  });

  return (
    <ConfigProvider
      theme={{
        token: {
          boxShadowSecondary:
            "0px 1px 3px 0px #1B1F241F, 0px 8px 24px 0px #424A531F",
        },
      }}
    >
      <_Dropdown {...props} />
    </ConfigProvider>
  );
};

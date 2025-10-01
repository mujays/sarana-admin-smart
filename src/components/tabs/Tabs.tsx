import React, { ReactNode } from "react";
import { Tabs as _Tabs } from "antd";
import { WithStyle } from "@/types/styles";

const { TabPane: _TabPane } = _Tabs;
export type TTabs = {
  defaultActiveKey?: string;
  activeKey?: string;
  onTabClick?: (key: string) => void;
  children: ReactNode;
};

/**
 * When to use: Use this when you easily switch between different views. Use in conjunction with Tab Pane
 */
export const Tabs = (props: WithStyle<TTabs>) => {
  return <_Tabs {...props}></_Tabs>;
};

Tabs.TabPane = _TabPane;

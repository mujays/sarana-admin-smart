import { Grid } from "antd";

const calculateDeviceType = (
  screens: ReturnType<typeof Grid.useBreakpoint>,
) => {
  if (screens.xxl || screens.xl || screens.lg) {
    return "non-mobile";
  } else {
    return "mobile";
  }
};

export const useDevice = () => {
  const screens = Grid.useBreakpoint();

  return calculateDeviceType(screens);
};

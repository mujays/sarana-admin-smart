import { Grid } from "antd";
import { useDevice } from "./device";
import { renderHook } from "@testing-library/react";

const mockedGrid = Grid as jest.Mocked<typeof Grid>;
jest.mock("antd", () => ({
  __esModule: true,
  ...jest.requireActual("antd"),
  Grid: {
    useBreakpoint: jest.fn(),
  },
}));

describe("device utils", () => {
  describe("useDevice", () => {
    it("should detect mobile devices", () => {
      mockedGrid.useBreakpoint.mockReturnValueOnce({
        xxl: false,
        xl: false,
        lg: false,
        md: false,
        sm: false,
        xs: true,
      });

      const { result } = renderHook(() => useDevice());

      expect(result.current).toBe("mobile");
    });

    it("should detect non mobile devices", () => {
      mockedGrid.useBreakpoint.mockReturnValueOnce({
        xxl: false,
        xl: false,
        lg: true,
        md: false,
        sm: false,
        xs: false,
      });

      const { result } = renderHook(() => useDevice());

      expect(result.current).toBe("non-mobile");
    });
  });
});

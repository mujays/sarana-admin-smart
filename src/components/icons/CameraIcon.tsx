import { SVGAttributes } from "react";

interface CameraIconProps {
  width?: SVGAttributes<SVGSVGElement>["width"];
  height?: SVGAttributes<SVGSVGElement>["height"];
  fill?: SVGAttributes<SVGSVGElement>["fill"];
}

export const CameraIcon = ({ fill, ...props }: CameraIconProps) => {
  return (
    <svg
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.03 8.03009L6.03 11.5001L3.5 14.6801L0 8.62009L4.03 8.03009ZM15 14.0001V11.2901C15.88 10.9001 16.5 10.0301 16.5 9.00009C16.5 8.43009 16.3 7.90009 15.97 7.50009L17.94 6.35009C18.95 5.76009 19.3 4.47009 18.71 3.46009L17.33 1.06009C16.74 0.050089 15.45 -0.299911 14.44 0.280089L6.31 5.00009C5.36 5.53009 5.03 6.75009 5.58 7.71009L7.08 10.3101C7.63 11.2601 8.86 11.5901 9.81 11.0401L11.69 9.96009C11.94 10.5501 12.41 11.0301 13 11.2901V14.0001C13 15.1001 13.9 16.0001 15 16.0001H20V14.0001H15Z"
        fill="#5F5AD5"
      />
    </svg>
  );
};

import { SVGAttributes } from "react";

interface DashboardIconProps {
  width?: SVGAttributes<SVGSVGElement>["width"];
  height?: SVGAttributes<SVGSVGElement>["height"];
  fill?: SVGAttributes<SVGSVGElement>["fill"];
}

export const DashboardIcon = ({ fill, ...props }: DashboardIconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask
        id="mask0_4643_4915"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_4643_4915)">
        <path
          d="M13 9V3H21V9H13ZM3 13V3H11V13H3ZM13 21V11H21V21H13ZM3 21V15H11V21H3ZM5 11H9V5H5V11ZM15 19H19V13H15V19ZM15 7H19V5H15V7ZM5 19H9V17H5V19Z"
          fill={fill ?? "#7C7C7C"}
        />
      </g>
    </svg>
  );
};

import { SVGAttributes } from "react";

export const ChevronDownIcon = ({
  fill,
  ...props
}: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.41 9.08008L12 13.6701L16.59 9.08008L18 10.5001L12 16.5001L6 10.5001L7.41 9.08008Z"
        fill={fill || "#121212"}
      />
    </svg>
  );
};

import { WithStyle } from "@/types/styles";
import React, { ReactNode } from "react";

type TClientOnly = {
  children: ReactNode;
};

export const ClientOnly = ({
  children,
  ...restOfProps
}: WithStyle<TClientOnly>) => {
  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return <div {...restOfProps} />;
  }

  return <>{children}</>;
};

export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
};

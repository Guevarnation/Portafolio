declare module "react-world-flags" {
  import React from "react";

  interface FlagProps {
    code: string;
    className?: string;
  }

  const Flag: React.FC<FlagProps>;

  export default Flag;
}

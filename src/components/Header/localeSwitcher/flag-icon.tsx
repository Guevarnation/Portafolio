import React from "react";
import ReactCountryFlag from "react-country-flag";

interface FlagIconProps {
  countryCode: string;
  style?: React.CSSProperties;
  className?: string;
}

const FlagIcon: React.FC<FlagIconProps> = ({
  countryCode,
  style,
  className,
}) => (
  <ReactCountryFlag
    countryCode={countryCode}
    svg
    style={{ width: "2em", height: "2em", ...style }}
    className={className}
  />
);

export default FlagIcon;

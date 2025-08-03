import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SmallDateIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const SmallDateIcon = ({ 
  width = 16, 
  height = 16, 
  color = "#9D9D9D" 
}: SmallDateIconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path 
        d="M12.5935 12.7934H3.37354V3.84009H12.5935V12.7934ZM4.20687 11.9601H11.7602V4.67342H4.20687V11.9601Z" 
        fill={color}
      />
      <Path 
        d="M12.2734 6.40015H3.56006V7.23348H12.2734V6.40015Z" 
        fill={color}
      />
      <Path 
        d="M6.36019 3.02686H5.52686V5.50686H6.36019V3.02686Z" 
        fill={color}
      />
      <Path 
        d="M10.4666 3.02686H9.6333V5.50686H10.4666V3.02686Z" 
        fill={color}
      />
    </Svg>
  );
};
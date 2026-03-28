import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Defs } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const BeautyCare = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><G clipPath="url(#a)"><Path fill="{color}" fillRule="evenodd" d="M8 3a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2v2h1.559a3 3 0 0 1 2.845 2.051l1.237 3.71A7 7 0 0 1 19 13.973V19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-5.026a7 7 0 0 1 .36-2.214l1.235-3.709A3 3 0 0 1 9.442 6H11V4H9a1 1 0 0 1-1-1m1.442 5a1 1 0 0 0-.95.684L7.722 11H10a1 1 0 0 1 0 2H7.096a5 5 0 0 0-.096.974V19a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-5.026c0-.538-.087-1.072-.257-1.582l-1.236-3.708A1 1 0 0 0 14.56 8z" clipRule="evenodd" /></G><Defs><ClipPath id="a"><Path fill="{color}" d="M0 0h24v24H0z" /></ClipPath></Defs></Svg>;
export default BeautyCare;
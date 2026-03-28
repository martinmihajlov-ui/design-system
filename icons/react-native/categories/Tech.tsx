import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Defs } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const Tech = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><G clipPath="url(#a)"><Path fill="{color}" d="M16 2a3 3 0 0 1 2.995 2.824L19 5v14a3 3 0 0 1-2.824 2.995L16 22H8a3 3 0 0 1-2.995-2.824L5 19V5a3 3 0 0 1 2.824-2.995L8 2zm0 2H8a1 1 0 0 0-.993.883L7 5v14a1 1 0 0 0 .883.993L8 20h8a1 1 0 0 0 .993-.883L17 19V5a1 1 0 0 0-1-1m-2 12a1 1 0 0 1 .117 1.993L14 18h-.5a1 1 0 0 1-.117-1.993L13.5 16zm-3.5 0a1 1 0 0 1 0 2H10a1 1 0 0 1 0-2zm3.5-3a1 1 0 0 1 .117 1.993L14 15h-.5a1 1 0 0 1-.117-1.993L13.5 13zm-3.5 0a1 1 0 0 1 0 2H10a1 1 0 0 1 0-2zM12 5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7m0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" /></G><Defs><ClipPath id="a"><Path fill="{color}" d="M0 0h24v24H0z" /></ClipPath></Defs></Svg>;
export default Tech;
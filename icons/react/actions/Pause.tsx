import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const Pause = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" d="M8 4a1 1 0 0 1 .993.883L9 5v14a1 1 0 0 1-1.993.117L7 19V5a1 1 0 0 1 1-1m8 0a1 1 0 0 1 .993.883L17 5v14a1 1 0 0 1-1.993.117L15 19V5a1 1 0 0 1 1-1" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default Pause;
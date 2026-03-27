import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const TiktokFill = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" fillRule="evenodd" d="M14 2a2 2 0 0 1 2 2 3.004 3.004 0 0 0 2.398 2.94 2 2 0 0 1-.796 3.92A7 7 0 0 1 16 10.325V16a6 6 0 1 1-7.499-5.81 2 2 0 0 1 .998 3.873A2.002 2.002 0 0 0 10 18a2 2 0 0 0 2-2V4a2 2 0 0 1 2-2" clipRule="evenodd" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default TiktokFill;
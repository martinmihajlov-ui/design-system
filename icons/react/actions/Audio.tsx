import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const Audio = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" fillRule="evenodd" d="M19.07 12.01a1 1 0 0 1 .85 1.132A8.004 8.004 0 0 1 13 19.938V21a1 1 0 0 1-2 0v-1.062a8.005 8.005 0 0 1-6.919-6.796 1 1 0 1 1 1.98-.284 6.002 6.002 0 0 0 11.878 0 1 1 0 0 1 1.131-.848M12 2a5 5 0 0 1 5 5v5a5 5 0 1 1-10 0V7a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3" clipRule="evenodd" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default Audio;
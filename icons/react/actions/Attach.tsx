import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const Attach = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" d="M5 15V9a1 1 0 0 1 2 0v6a5 5 0 1 0 10 0V7a3 3 0 1 0-6 0v8a1 1 0 0 0 2 0V9a1 1 0 0 1 2 0v6a3 3 0 0 1-6 0V7a5 5 0 1 1 10 0v8a7.001 7.001 0 0 1-11.95 4.95A7 7 0 0 1 5 15" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default Attach;
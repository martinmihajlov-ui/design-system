import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const ArrowSmallUp = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" fillRule="evenodd" d="M11.293 9.464a1 1 0 0 1 1.414 0l2.829 2.829A1 1 0 0 1 14.828 14H9.172a1 1 0 0 1-.708-1.707z" clipRule="evenodd" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default ArrowSmallUp;
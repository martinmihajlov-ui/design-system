import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const ArrowSmallDown = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" fillRule="evenodd" d="M12.707 14.536a1 1 0 0 1-1.414 0l-2.829-2.829A1 1 0 0 1 9.172 10h5.656a1 1 0 0 1 .708 1.707z" clipRule="evenodd" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default ArrowSmallDown;
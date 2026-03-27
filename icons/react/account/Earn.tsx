import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const Earn = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" fillRule="evenodd" d="M4 17V5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v12a1 1 0 0 1 .351 1.936l-8 3a1 1 0 0 1-.702 0l-8-3A1 1 0 0 1 4 17m9-11a1 1 0 0 0-2 0v1h-1a2.5 2.5 0 1 0 0 5h4a.5.5 0 0 1 0 1H9a1 1 0 0 0 0 2h2v1a1 1 0 0 0 2 0v-1h1a2.5 2.5 0 0 0 0-5h-4a.5.5 0 1 1 0-1h5a1 1 0 1 0 0-2h-2z" clipRule="evenodd" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default Earn;
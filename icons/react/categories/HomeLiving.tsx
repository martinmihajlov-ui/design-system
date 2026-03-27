import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const HomeLiving = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" fillRule="evenodd" d="M10 3a5 5 0 0 0-5 5v1.17A3 3 0 0 0 3 12v5a2 2 0 0 0 2 2v1a1 1 0 1 0 2 0v-1h10v1a1 1 0 0 0 2 0v-1a2 2 0 0 0 2-2v-5a3 3 0 0 0-2-2.83V8a5 5 0 0 0-5-5zm7 6.17V8a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v1.17c1.165.413 2 1.524 2 2.83v1h6v-1c0-1.306.835-2.417 2-2.83M5 12a1 1 0 1 1 2 0v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2a1 1 0 0 1 2 0v5H5z" clipRule="evenodd" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default HomeLiving;
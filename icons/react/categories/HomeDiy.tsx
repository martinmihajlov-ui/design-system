import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const HomeDiy = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" fillRule="evenodd" d="M3 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3h1a2 2 0 0 1 2 2v1.38a5 5 0 0 1-4.503 4.975l-5.497.55V14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2v-.095a2 2 0 0 1 1.801-1.99l5.498-.55A3 3 0 0 0 20 8.38V7h-1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm9 11h-2v4h2zM6 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z" clipRule="evenodd" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default HomeDiy;
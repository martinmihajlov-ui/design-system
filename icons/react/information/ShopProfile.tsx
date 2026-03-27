import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const ShopProfile = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" fillRule="evenodd" d="M17.5 3a2 2 0 0 1 1.6.8l2.688 3.584a1 1 0 0 1 .204.616H22v1a4 4 0 0 1-1 2.646V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7.354A3.99 3.99 0 0 1 2 9V8h.008a1 1 0 0 1 .204-.616L4.9 3.8A2 2 0 0 1 6.5 3zM15 11.646A4 4 0 0 1 12 13a4 4 0 0 1-3-1.354 3.99 3.99 0 0 1-3.757 1.282L5 12.874V19h14v-6.126l-.243.054A3.99 3.99 0 0 1 15 11.646M20 9h-4a2 2 0 0 0 3.995.15zm-6 0h-4a2 2 0 0 0 3.995.15zM8 9H4a2 2 0 0 0 3.995.15zm9.5-4h-11L5 7h14z" clipRule="evenodd" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default ShopProfile;
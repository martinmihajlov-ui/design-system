import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const Merchant = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" fillRule="evenodd" d="M17.5 3a2 2 0 0 1 1.6.8l2.688 3.584a1 1 0 0 1 .204.616H22v1a4 4 0 0 1-1 2.646V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7.354A3.99 3.99 0 0 1 2 9V8h.008a1 1 0 0 1 .204-.616L4.9 3.8A2 2 0 0 1 6.5 3zM20 9h-4a2 2 0 0 0 3.995.15zm-6 0h-4a2 2 0 0 0 3.995.15zM8 9H4a2 2 0 0 0 3.995.15z" clipRule="evenodd" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default Merchant;
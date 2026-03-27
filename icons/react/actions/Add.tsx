import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const Add = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" d="M11 20a1 1 0 0 0 2 0v-7h7a1 1 0 0 0 0-2h-7V4a1 1 0 0 0-2 0v7H4a1 1 0 0 0 0 2h7z" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default Add;
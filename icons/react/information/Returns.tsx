import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const Returns = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" d="M6.046 11.677A7.5 7.5 0 0 1 20 15.5a1 1 0 0 0 2 0A9.5 9.5 0 0 0 4.78 9.963l-.537-3.045a1 1 0 1 0-1.97.347l1.042 5.909a1 1 0 0 0 .885.822 1.1 1.1 0 0 0 .502-.052l5.68-1.001a1 1 0 1 0-.347-1.97z" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default Returns;
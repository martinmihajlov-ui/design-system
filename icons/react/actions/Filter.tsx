import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const Filter = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" d="M14 17a1 1 0 0 1 .117 1.993L14 19h-4a1 1 0 0 1-.117-1.993L10 17zm3-6a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm3-6a1 1 0 1 1 0 2H4a1 1 0 0 1 0-2z" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default Filter;
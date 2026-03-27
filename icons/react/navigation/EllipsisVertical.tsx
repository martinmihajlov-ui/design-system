import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const EllipsisVertical = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" d="M12 16.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m0-6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m0-6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default EllipsisVertical;
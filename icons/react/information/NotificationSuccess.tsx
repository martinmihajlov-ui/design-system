import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const NotificationSuccess = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16m3.535 4.381a1 1 0 0 1 1.498 1.32l-.083.094-5.586 5.587a1.1 1.1 0 0 1-1.46.085l-.096-.085-2.758-2.758a1 1 0 0 1 1.32-1.498l.094.084 2.122 2.121z" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default NotificationSuccess;
import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const Dashboard = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10a9.97 9.97 0 0 1-2.938 7.08c-.4.4-1.05.392-1.44-.013l-.842-.873a1 1 0 0 1 1.44-1.388l.098.102a8 8 0 1 0-12.636 0l.098-.102a1 1 0 1 1 1.44 1.388l-.842.873a1.01 1.01 0 0 1-1.44.013A9.97 9.97 0 0 1 2 12C2 6.477 6.477 2 12 2m0 4a1 1 0 0 1 1 1v5.268a2 2 0 1 1-2 0V7a1 1 0 0 1 1-1" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default Dashboard;
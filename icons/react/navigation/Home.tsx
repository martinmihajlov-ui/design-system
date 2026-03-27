import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const Home = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" fillRule="evenodd" d="M10.8 2.65a2 2 0 0 1 2.4 0l7 5.25a2 2 0 0 1 .8 1.6V19a2 2 0 0 1-2 2h-4.9a1.1 1.1 0 0 1-1.1-1.1V14a1 1 0 0 0-2 0v5.9A1.1 1.1 0 0 1 9.9 21H5a2 2 0 0 1-2-2V9.5a2 2 0 0 1 .8-1.6zm1.2 1.6L5 9.5V19h4v-5a3 3 0 0 1 6 0v5h4V9.5z" clipRule="evenodd" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default Home;
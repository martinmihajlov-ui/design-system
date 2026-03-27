import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const Box = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" fillRule="evenodd" d="M12.25 4.299a.5.5 0 0 0-.5 0L6.206 7.5l1.813 1.047 5.798-3.343zm3.568 2.06L10.02 9.702l1.73.999a.5.5 0 0 0 .5 0L17.794 7.5zm2.976 2.873-5.544 3.201q-.12.071-.25.126v6.709l5.544-3.201a.5.5 0 0 0 .25-.433zM11 19.268v-6.709a3 3 0 0 1-.25-.126L5.206 9.232v6.402a.5.5 0 0 0 .25.433zm-.25-16.701a2.5 2.5 0 0 1 2.5 0l6.294 3.634a2.5 2.5 0 0 1 1.25 2.165v7.268a2.5 2.5 0 0 1-1.25 2.165l-6.294 3.634a2.5 2.5 0 0 1-2.5 0l-6.294-3.634a2.5 2.5 0 0 1-1.25-2.165V8.366a2.5 2.5 0 0 1 1.25-2.165z" clipRule="evenodd" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default Box;
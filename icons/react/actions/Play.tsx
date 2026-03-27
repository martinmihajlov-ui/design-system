import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const Play = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" fillRule="evenodd" d="M7.575 5.708a62 62 0 0 0-.302 6.287c0 2.801.17 4.997.302 6.289a63 63 0 0 0 5.595-2.887 63 63 0 0 0 5.296-3.401 63 63 0 0 0-5.295-3.405 63 63 0 0 0-5.596-2.883M5.67 4.76a1.47 1.47 0 0 1 2.04-1.177c1.062.454 3.442 1.533 6.462 3.276 3.021 1.744 5.146 3.267 6.069 3.958.788.591.79 1.763.001 2.356-.914.687-3.013 2.19-6.07 3.956-3.06 1.766-5.412 2.832-6.464 3.28-.906.387-1.92-.2-2.038-1.177-.138-1.142-.396-3.735-.396-7.237 0-3.5.257-6.092.396-7.235" clipRule="evenodd" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default Play;
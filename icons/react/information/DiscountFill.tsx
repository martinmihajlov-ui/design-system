import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const DiscountFill = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><g clipPath="url(#a)"><path fill="currentColor" fillRule="evenodd" d="M9.405 2.897a4 4 0 0 1 5.02-.136l.17.136.376.32a2 2 0 0 0 .96.45l.178.022.493.04a4 4 0 0 1 3.648 3.468l.021.2.04.494a2 2 0 0 0 .36.996l.11.142.322.376a4 4 0 0 1 .136 5.02l-.136.17-.321.376a2 2 0 0 0-.45.96l-.022.178-.039.493a4 4 0 0 1-3.468 3.648l-.201.021-.493.04a2 2 0 0 0-.996.36l-.142.111-.377.32a4 4 0 0 1-5.02.137l-.169-.136-.376-.321a2 2 0 0 0-.96-.45l-.178-.021-.493-.04a4 4 0 0 1-3.648-3.468l-.021-.2-.04-.494a2 2 0 0 0-.36-.996l-.111-.142-.321-.377a4 4 0 0 1-.136-5.02l.136-.169.32-.376a2 2 0 0 0 .45-.96l.022-.178.04-.493A4 4 0 0 1 7.197 3.75l.2-.021.494-.04a2 2 0 0 0 .996-.36l.142-.111zM14.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-.207-4.707-6 6a1 1 0 1 0 1.414 1.414l6-6a1 1 0 0 0-1.414-1.414M9.5 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" clipRule="evenodd" /></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z" /></clipPath></defs></svg>;
export default DiscountFill;
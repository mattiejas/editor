import { React } from "react";

export const Line = ({ text, onUpdate, ...props }) => (
  <div onInput={onUpdate} onBlur={onUpdate} contentEditable dangerouslySetInnerHTML={{ __html: text }} {...props}></div>
);

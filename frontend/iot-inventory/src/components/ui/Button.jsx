
import React from "react";

export default function Button({children, onClick, className = "", ...rest}){
  return (
    <button onClick={onClick} className={"card " + className} {...rest}>
      {children}
    </button>
  );
}

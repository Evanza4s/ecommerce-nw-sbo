import React from "react";

interface InputGroupProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
}

const InputGroup = ({ children, cols = 1 }: InputGroupProps) => {
  return (
    <div
      className={
        cols === 3
          ? "grid grid-cols-1 gap-4 md:grid-cols-3"
          : cols === 2
            ? "grid grid-cols-1 gap-4 md:grid-cols-2"
            : "w-full"
      }
    >
      {children}
    </div>
  );
};

export default InputGroup;

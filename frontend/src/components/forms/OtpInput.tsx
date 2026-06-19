"use client";

import { useRef, useEffect } from "react";

interface OtpInputProps {
  value?: string;
  onChange?: (otp: string) => void;
  length?: number;
}

const OtpInput = ({ value = "", onChange, length = 6 }: OtpInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpArray = value.split("").concat(Array(length).fill("")).slice(0, length);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (inputValue: string, index: number) => {
    if (!/^\d?$/.test(inputValue)) return;

    const newOtp = [...otpArray];
    newOtp[index] = inputValue;

    const otpString = newOtp.join("");
    onChange?.(otpString);

    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange?.(pastedData);
  };

  return (
    <div className="flex justify-center gap-3 py-6">
      {otpArray.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          value={digit}
          maxLength={1}
          inputMode="numeric"
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="h-14 w-14 rounded-lg border border-black/20 bg-background text-center text-xl font-bold outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      ))}
    </div>
  );
};

export default OtpInput;

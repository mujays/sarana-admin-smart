import React from "react";
import { Input, InputProps } from "antd";
import { formatCurrency } from "@/stores/utils";

interface CurrencyInputProps extends Omit<InputProps, "onChange" | "value"> {
  value?: number | string | null;
  onChange?: (value: number | null) => void;
  allowNegative?: boolean;
  maxValue?: number;
  minValue?: number;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  allowNegative = false,
  maxValue,
  minValue = 0,
  placeholder = "Rp 0",
  ...props
}) => {
  // Format value untuk ditampilkan
  const formatDisplayValue = (
    val: number | string | null | undefined,
  ): string => {
    if (!val || val === "" || val === null) return "";

    const numValue = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(numValue)) return "";

    return formatCurrency(numValue);
  };

  // Parse input string ke number
  const parseInputValue = (input: string): number | null => {
    // Remove semua karakter selain digit dan minus (jika allowed)
    const cleanInput = input.replace(/[^\d-]/g, "");

    if (!cleanInput || cleanInput === "-") return null;

    const numValue = parseInt(cleanInput, 10);

    if (isNaN(numValue)) return null;

    // Validasi range
    if (!allowNegative && numValue < 0) return null;
    if (minValue !== undefined && numValue < minValue) return null;
    if (maxValue !== undefined && numValue > maxValue) return null;

    return numValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const parsedValue = parseInputValue(inputValue);

    if (onChange) {
      onChange(parsedValue);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Saat focus, tampilkan value mentah untuk editing
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (numValue && !isNaN(numValue)) {
      e.target.value = numValue.toString();
    }

    // Call original onFocus jika ada
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Saat blur, format kembali ke currency
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (numValue && !isNaN(numValue)) {
      e.target.value = formatCurrency(numValue);
    }

    // Call original onBlur jika ada
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  return (
    <Input
      {...props}
      value={formatDisplayValue(value)}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      style={{
        ...props.style,
      }}
    />
  );
};

export default CurrencyInput;

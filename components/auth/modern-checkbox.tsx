"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface ModernCheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function ModernCheckbox({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
}: ModernCheckboxProps) {
  const isReversed = className.includes("flex-row-reverse");
  const gapClass = className.includes("gap-2") ? "gap-2" : "gap-3";
  
  return (
    <label
      htmlFor={id}
      className={`flex items-start cursor-pointer group ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className} ${!className.includes("gap-") ? gapClass : ""}`}
    >
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <motion.div
          className={`w-4 h-4 rounded border-2 transition-all duration-200 ${
            checked
              ? "bg-netflix-red border-netflix-red"
              : "bg-transparent border-gray-600 group-hover:border-gray-500"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            initial={false}
            animate={{
              scale: checked ? 1 : 0,
              opacity: checked ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-full h-full"
          >
            <Check size={12} className="text-white" />
          </motion.div>
        </motion.div>
      </div>
      <span className="text-sm text-gray-300 leading-relaxed select-none">
        {label}
      </span>
    </label>
  );
}

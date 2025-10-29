import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

const PasswordChecker = ({ password, onChange, isVisible = false }) => {
  const [strength, setStrength] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    // Check requirements
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setRequirements(checks);

    // Calculate strength (0-100)
    const passedChecks = Object.values(checks).filter(Boolean).length;
    setStrength((passedChecks / 5) * 100);
  }, [password]);

  const getStrengthColor = () => {
    if (strength >= 100) return "bg-green-500";
    if (strength >= 60) return "bg-yellow-500";
    if (strength >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  const renderRequirement = (met, text) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <FaCheck className="text-green-500" />
      ) : (
        <FaTimes className="text-red-500" />
      )}
      <span
        className={met ? "text-green-500" : "text-gray-500 dark:text-gray-400"}
      >
        {text}
      </span>
    </div>
  );

  return (
    <div
      className={`space-y-3 overflow-hidden transition-all duration-300 ease-in-out ${
        isVisible ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      {/* Strength bar */}
      <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${strength}%` }}
        />
      </div>

      {/* Requirements list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {renderRequirement(requirements.length, "At least 8 characters")}
        {renderRequirement(requirements.uppercase, "One uppercase letter")}
        {renderRequirement(requirements.lowercase, "One lowercase letter")}
        {renderRequirement(requirements.number, "One number")}
        {renderRequirement(requirements.special, "One special character")}
      </div>
    </div>
  );
};

export default PasswordChecker;

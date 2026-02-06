import React from "react";
import { motion } from "framer-motion";
import { 
  FiCheckCircle, 
  FiLoader, 
  FiPackage, 
  FiTruck, 
  FiHome,
  FiXCircle 
} from "react-icons/fi";

const OrderTracker = ({ status }) => {
  const steps = [
    { id: "pending", label: "Order Placed", icon: FiLoader },
    { id: "confirmed", label: "Confirmed", icon: FiCheckCircle },
    { id: "preparing", label: "Preparing", icon: FiPackage },
    { id: "out_for_delivery", label: "On the Way", icon: FiTruck },
    { id: "delivered", label: "Delivered", icon: FiHome },
  ];

  // Map status string to an index
  const getCurrentStepIndex = () => {
    if (status === "cancelled") return -1;
    const index = steps.findIndex((s) => s.id === status);
    return index === -1 ? 0 : index;
  };

  const currentStep = getCurrentStepIndex();
  const isCancelled = status === "cancelled";

  if (isCancelled) {
    return (
      <div className="w-full py-6 flex flex-col items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
        <FiXCircle className="text-4xl mb-2" />
        <span className="font-bold">This order has been cancelled</span>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6 md:gap-0">
        
        {/* Progress Bar Background (Desktop) */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 hidden md:block -z-10 rounded-full" />
        
        {/* Active Progress Bar (Desktop) */}
        <motion.div 
          className="absolute top-5 left-0 h-1 bg-primary hidden md:block -z-10 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isFuture = index > currentStep;

          return (
            <div key={step.id} className="relative flex md:flex-col items-center gap-4 md:gap-2 w-full md:w-auto">
              
              {/* Vertical Line for Mobile */}
              {index !== steps.length - 1 && (
                 <div className={`absolute left-5 top-10 bottom-[-24px] w-0.5 md:hidden ${
                    isCompleted ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                 }`} />
              )}

              {/* Icon Circle */}
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted || isActive ? "var(--color-primary)" : "var(--color-card)",
                  borderColor: isCompleted || isActive ? "var(--color-primary)" : "var(--color-border)",
                }}
                className={`z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300 ${
                  isFuture 
                    ? "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400" 
                    : "text-white border-primary bg-primary"
                }`}
              >
                <Icon className="text-lg" />
              </motion.div>

              {/* Label */}
              <div className={`flex flex-col md:items-center ${isActive ? "opacity-100" : "opacity-70"}`}>
                <span className={`text-xs md:text-sm font-bold ${
                  isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"
                }`}>
                  {step.label}
                </span>
                {isActive && (
                    <motion.span 
                        layoutId="active-indicator"
                        className="hidden md:block text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1"
                    >
                        Current Status
                    </motion.span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;

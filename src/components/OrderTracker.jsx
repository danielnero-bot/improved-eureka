import React, { useRef } from "react";
import { 
  FiCheckCircle, 
  FiLoader, 
  FiPackage, 
  FiTruck, 
  FiHome,
  FiXCircle 
} from "react-icons/fi";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const OrderTracker = ({ status }) => {
  const containerRef = useRef(null);
  
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

  useGSAP(() => {
    if (isCancelled) return;

    // Animate the progress bar fill width
    gsap.to(".progress-bar-fill", {
      width: `${(currentStep / (steps.length - 1)) * 100}%`,
      duration: 0.5,
      ease: "power2.inOut"
    });

    // Animate scale of the active indicator
    gsap.fromTo(".active-indicator", 
      { opacity: 0, y: -5 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );
  }, { scope: containerRef, dependencies: [currentStep, isCancelled] });

  if (isCancelled) {
    return (
      <div className="w-full py-6 flex flex-col items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
        <FiXCircle className="text-4xl mb-2" />
        <span className="font-bold">This order has been cancelled</span>
      </div>
    );
  }

  return (
    <div className="w-full py-4" ref={containerRef}>
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6 md:gap-0">
        
        {/* Progress Bar Background (Desktop) */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 hidden md:block -z-10 rounded-full" />
        
        {/* Active Progress Bar (Desktop) */}
        <div 
          className="progress-bar-fill absolute top-5 left-0 h-1 bg-primary hidden md:block -z-10 rounded-full"
          style={{ width: "0%" }}
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
              <div
                className={`z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  isFuture 
                    ? "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400" 
                    : "text-white border-primary bg-primary"
                }`}
                style={{
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                  backgroundColor: isCompleted || isActive ? "var(--color-primary)" : "var(--color-card)",
                  borderColor: isCompleted || isActive ? "var(--color-primary)" : "var(--color-border)",
                }}
              >
                <Icon className="text-lg" />
              </div>

              {/* Label */}
              <div className={`flex flex-col md:items-center transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-70"}`}>
                <span className={`text-xs md:text-sm font-bold ${
                  isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"
                }`}>
                  {step.label}
                </span>
                {isActive && (
                    <span 
                        className="active-indicator hidden md:block text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1"
                    >
                        Current Status
                    </span>
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

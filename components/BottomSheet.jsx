"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const BottomSheet = ({
  isOpen,
  onCloseStart,
  onClose,
  children,
  header,
  className = "",
  backdropClassName = "",
  style = {},
}) => {
  const handleClose = () => {
    if (onCloseStart) onCloseStart();
    if (onClose) onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto"
          style={style}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 bg-black/40 backdrop-blur-xs ${backdropClassName}`}
            onClick={handleClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                handleClose();
              }
            }}
            className={`relative z-10 w-full max-w-lg bg-white rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${className}`}>
            {header || (
              <div className="flex justify-center py-2.5 cursor-grab active:cursor-grabbing">
                <div className="w-10 h-1.5 rounded-full bg-gray-300"></div>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;

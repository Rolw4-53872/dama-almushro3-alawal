import React from 'react';

interface ErrorMessageProps {
  message?: string | null;
  onClose?: () => void;
  title?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onClose,
  title = 'خطأ',
}) => {
  if (!message) return null;

  return (
    <div className="bg-danger-50 border-l-4 border-danger-600 p-4 rounded">
      <div className="flex items-start gap-3">
        <div className="text-danger-600 text-xl">!</div>
        <div className="flex-1">
          <p className="font-semibold text-danger-800">{title}</p>
          <p className="text-danger-700 text-sm mt-1">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-danger-600 hover:text-danger-700 font-bold"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

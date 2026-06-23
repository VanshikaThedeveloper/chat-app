import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorState = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-danger" />
      </div>
      <h3 className="text-lg font-semibold text-dark-200 mb-2">Oops!</h3>
      <p className="text-dark-400 text-sm max-w-xs mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-dark-200 text-sm font-medium transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;

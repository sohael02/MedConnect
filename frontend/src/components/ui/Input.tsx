import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/helpers';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg border bg-white dark:bg-secondary-800 px-4 py-2.5 text-sm text-secondary-900 dark:text-white placeholder:text-secondary-400 dark:placeholder:text-secondary-500 transition-all duration-200 focus:ring-2 focus:outline-none',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-secondary-300 dark:border-secondary-600 focus:border-primary-500 focus:ring-primary-500/20',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-secondary-500 dark:text-secondary-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full rounded-lg border bg-white dark:bg-secondary-800 px-4 py-2.5 text-sm text-secondary-900 dark:text-white placeholder:text-secondary-400 dark:placeholder:text-secondary-500 transition-all duration-200 focus:ring-2 focus:outline-none resize-y min-h-[100px]',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-secondary-300 dark:border-secondary-600 focus:border-primary-500 focus:ring-primary-500/20',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="mt-1.5 text-sm text-secondary-500 dark:text-secondary-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
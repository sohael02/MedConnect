import { cn } from '../../utils/helpers';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'gray';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'gray',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const variantClasses = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    gray: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-300',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = false }: StatusBadgeProps) {
  const variants: Record<string, 'success' | 'warning' | 'error' | 'info' | 'gray'> = {
    in_stock: 'success',
    out_of_stock: 'error',
    limited: 'warning',
    unverified: 'gray',
    discontinued: 'gray',
  };

  const labels: Record<string, string> = {
    in_stock: 'In Stock',
    out_of_stock: 'Out of Stock',
    limited: 'Limited Stock',
    unverified: 'Availability Unverified',
    discontinued: 'Discontinued',
  };

  const icons: Record<string, string> = {
    in_stock: 'check-circle',
    out_of_stock: 'x-circle',
    limited: 'alert-triangle',
    unverified: 'help-circle',
    discontinued: 'archive',
  };

  const variant = variants[status] || 'gray';
  const label = labels[status] || status;

  return (
    <Badge variant={variant}>
      {showIcon && icons[status] && (
        <span className="mr-1" data-lucide={icons[status]} />
      )}
      {label}
    </Badge>
  );
}
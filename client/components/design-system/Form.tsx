import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./Label";

// Form Context for managing form state
interface FormContextType {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  setTouched: (field: string, isTouched: boolean) => void;
}

const FormContext = React.createContext<FormContextType | undefined>(undefined);

export function useFormContext() {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}

// Form Provider Component
interface FormProviderProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export function Form({ children, onSubmit, className }: FormProviderProps) {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouchedState] = React.useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const setError = React.useCallback((field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  const clearError = React.useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const setTouched = React.useCallback((field: string, isTouched: boolean) => {
    setTouchedState((prev) => ({ ...prev, [field]: isTouched }));
  }, []);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await onSubmit?.(e);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit],
  );

  const contextValue: FormContextType = {
    errors,
    touched,
    isSubmitting,
    setError,
    clearError,
    setTouched,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

// Form Field Component
interface FormFieldProps {
  name: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ name, children, className }: FormFieldProps) {
  const { errors, touched } = useFormContext();
  const error = errors[name];
  const isTouched = touched[name];
  const showError = error && isTouched;

  return (
    <div className={cn("space-y-2", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            error: showError ? error : undefined,
            name,
          } as any);
        }
        return child;
      })}
    </div>
  );
}

// Form Label Component
interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}

export function FormLabel({
  children,
  required,
  optional,
  className,
  ...props
}: FormLabelProps) {
  return (
    <Label className={cn("block text-sm font-medium", className)} {...props}>
      {children}
      {required && <span className="text-destructive ms-1">*</span>}
      {optional && (
        <span className="text-muted-foreground ms-1 font-normal">
          (optional)
        </span>
      )}
    </Label>
  );
}

// Form Message Component
interface FormMessageProps {
  children?: React.ReactNode;
  type?: "error" | "success" | "warning" | "info";
  className?: string;
}

export function FormMessage({
  children,
  type = "error",
  className,
}: FormMessageProps) {
  if (!children) return null;

  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    warning: AlertTriangle,
    info: AlertCircle,
  };

  const colors = {
    error: "text-destructive",
    success: "text-green-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  };

  const Icon = icons[type];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        transition={{ duration: 0.2 }}
        className={cn("flex items-center gap-2 text-sm", colors[type], className)}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span>{children}</span>
      </motion.div>
    </AnimatePresence>
  );
}

// Form Control Wrapper
interface FormControlProps {
  children: React.ReactNode;
  className?: string;
}

export function FormControl({ children, className }: FormControlProps) {
  return <div className={cn("relative", className)}>{children}</div>;
}

// Form Item Component (combines all form elements)
interface FormItemProps {
  name: string;
  label?: string;
  required?: boolean;
  optional?: boolean;
  help?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormItem({
  name,
  label,
  required,
  optional,
  help,
  children,
  className,
}: FormItemProps) {
  const { errors, touched } = useFormContext();
  const error = errors[name];
  const isTouched = touched[name];
  const showError = error && isTouched;

  return (
    <FormField name={name} className={className}>
      {label && (
        <FormLabel htmlFor={name} required={required} optional={optional}>
          {label}
        </FormLabel>
      )}
      <FormControl>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...child.props,
              id: name,
              name,
              error: showError ? error : undefined,
            } as any);
          }
          return child;
        })}
      </FormControl>
      {showError && <FormMessage type="error">{error}</FormMessage>}
      {help && !showError && (
        <p className="text-sm text-muted-foreground">{help}</p>
      )}
    </FormField>
  );
}

// Enhanced Form Hook for validation
interface UseFormProps {
  initialValues?: Record<string, any>;
  validationSchema?: Record<string, (value: any) => string | undefined>;
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
}

export function useForm({
  initialValues = {},
  validationSchema = {},
  onSubmit,
}: UseFormProps = {}) {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const setValue = React.useCallback((name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const setFieldTouched = React.useCallback((name: string, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [name]: isTouched }));
  }, []);

  const validateField = React.useCallback((name: string, value: any) => {
    const validator = validationSchema[name];
    if (validator) {
      const error = validator(value);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
        return false;
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        return true;
      }
    }
    return true;
  }, [validationSchema]);

  const validateAll = React.useCallback(() => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    Object.keys(validationSchema).forEach((name) => {
      const validator = validationSchema[name];
      const error = validator(values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationSchema]);

  const handleSubmit = React.useCallback(async () => {
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(validationSchema).forEach((name) => {
      allTouched[name] = true;
    });
    setTouched(allTouched);

    try {
      if (validateAll()) {
        await onSubmit?.(values);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateAll, onSubmit]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    validateField,
    validateAll,
    handleSubmit,
  };
} 
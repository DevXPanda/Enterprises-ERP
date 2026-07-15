"use client";

import React, { useEffect, useRef } from "react";
import { 
  X, AlertTriangle, CheckCircle2, Mail, Phone, Calendar, 
  Building2, User, Package, Cog, Truck, Search, 
  ClipboardList, Shield, IndianRupee, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================================
   1. FORMDIALOG COMPONENT
   ============================================================================ */

export interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  className?: string;
}

export function FormDialog({
  isOpen,
  onClose,
  children,
  size = "2xl",
  className,
}: FormDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation & Accessibility handlers (Escape to close, Focus trapping)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"], [contenteditable]'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // shift + tab (go backwards)
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          // tab (go forwards)
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Auto-focus the first editable input or button
    const timer = setTimeout(() => {
      if (dialogRef.current) {
        const firstInput = dialogRef.current.querySelector<HTMLElement>(
          'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])'
        );
        if (firstInput) {
          firstInput.focus();
        } else {
          const closeBtn = dialogRef.current.querySelector<HTMLElement>('button[aria-label="Close dialog"]');
          closeBtn?.focus();
        }
      }
    }, 100);

    // Prevent body scrolling behind modal
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop blur & overlay */}
      <div 
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog box body */}
      <div 
        ref={dialogRef}
        className={cn(
          "w-full glass-card shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden z-10 border border-border/40 transform transition-all duration-300 scale-100 opacity-100",
          sizeClasses[size],
          className
        )}
        style={{ borderRadius: "16px" }}
      >
        {children}
      </div>
    </div>
  );
}

/* ============================================================================
   2. FORMHEADER COMPONENT
   ============================================================================ */

export interface FormHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
}

export function FormHeader({ title, description, icon, onClose }: FormHeaderProps) {
  return (
    <div className="flex items-start justify-between p-6 border-b border-border/20 bg-navy-900/10">
      <div className="flex gap-4">
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary shrink-0">
            {icon}
          </div>
        )}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-muted/80 leading-relaxed max-w-xl">
              {description}
            </p>
          )}
        </div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-muted hover:text-white rounded-lg hover:bg-white/5 transition-all outline-none focus:ring-1 focus:ring-primary/30"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/* ============================================================================
   3. FORMSECTION COMPONENT
   ============================================================================ */

export interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="pb-1.5 border-b border-border/10">
        <h3 className="text-xs font-bold text-white tracking-wider uppercase">
          {title}
        </h3>
        {description && (
          <p className="text-[11px] text-muted/70 mt-0.5">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/* ============================================================================
   4. FORMGRID COMPONENT
   ============================================================================ */

export interface FormGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
}

export function FormGrid({ children, cols = 2, className }: FormGridProps) {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <div className={cn("grid gap-5", colClasses[cols], className)}>
      {children}
    </div>
  );
}

/* ============================================================================
   5. FORMFIELD COMPONENT
   ============================================================================ */

export interface FormFieldProps {
  label: string;
  fieldName?: string; // Key name used to automatically resolve input icons
  required?: boolean;
  error?: string;
  success?: boolean;
  helpText?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// Lightweight Lucide icon mapping based on common form keys
export function getFieldIcon(fieldName?: string): React.ReactNode | null {
  if (!fieldName) return null;
  const k = fieldName.toLowerCase();
  
  if (k.includes("email") || k.includes("mail")) return <Mail className="w-4.5 h-4.5" />;
  if (k.includes("phone") || k.includes("mobile") || k.includes("contact") || k.includes("tele")) return <Phone className="w-4.5 h-4.5" />;
  if (k.includes("date") || k === "period" || k.includes("valid") || k.includes("schedule") || k.includes("time")) return <Calendar className="w-4.5 h-4.5" />;
  if (k.includes("dept") || k.includes("department") || k.includes("branch") || k.includes("factory") || k.includes("plant")) return <Building2 className="w-4.5 h-4.5" />;
  if (k.includes("name") || k === "operator" || k === "author" || k === "employee" || k === "worker" || k === "customer" || k === "visitor" || k === "user") return <User className="w-4.5 h-4.5" />;
  if (k.includes("material") || k === "item" || k === "bom" || k.includes("stock") || k.includes("product") || k === "output" || k.includes("ingredient")) return <Package className="w-4.5 h-4.5" />;
  if (k.includes("machine") || k === "line" || k.includes("asset") || k.includes("eq")) return <Cog className="w-4.5 h-4.5" />;
  if (k.includes("vehicle") || k === "truck" || k === "transport" || k.includes("exit") || k.includes("entry")) return <Truck className="w-4.5 h-4.5" />;
  if (k.includes("search") || k === "query") return <Search className="w-4.5 h-4.5" />;
  if (k.includes("code") || k.includes("no") || k === "id" || k.includes("batch") || k.includes("order") || k.includes("card") || k.includes("receipt") || k.includes("pass")) return <ClipboardList className="w-4.5 h-4.5" />;
  if (k.includes("status") || k.includes("approval") || k.includes("result") || k === "rating") return <Shield className="w-4.5 h-4.5" />;
  if (k.includes("cost") || k.includes("rate") || k.includes("wage") || k.includes("pay") || k.includes("amount") || k.includes("incentive") || k.includes("rupee") || k.includes("rs") || k.includes("salary") || k.includes("deduct") || k.includes("payout")) return <IndianRupee className="w-4.5 h-4.5" />;
  return null;
}

export function FormField({
  label,
  fieldName,
  required,
  error,
  success,
  helpText,
  icon,
  children,
  className,
}: FormFieldProps) {
  const resolvedIcon = icon || getFieldIcon(fieldName || label);
  
  let modifiedChildren = children;

  // Dynamically inspect children to inject standardized enterprise input styling
  if (React.isValidElement(children)) {
    const isStandardTag = ["input", "textarea", "select"].includes(children.type as string);
    const hasPropsClass = (children.props as any).className !== undefined || isStandardTag;

    if (hasPropsClass) {
      const hasIcon = !!resolvedIcon;
      const isTextarea = children.type === "textarea";
      
      const combinedInputClass = cn(
        "w-full bg-navy-200/50 border border-border/40 text-sm text-white placeholder:text-muted/40 transition-all duration-200 outline-none",
        "rounded-xl hover:border-border/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/20",
        isTextarea ? "py-3 min-h-[110px] resize-y" : "h-[48px] px-4",
        hasIcon ? "pl-11" : "",
        error ? "border-danger focus:border-danger focus:ring-danger/10 text-danger pr-10" : "",
        success && !error ? "border-success focus:border-success focus:ring-success/10 pr-10" : "",
        "disabled:opacity-40 disabled:bg-navy-300/20 disabled:cursor-not-allowed",
        "readOnly:bg-navy-300/10 readOnly:border-border/20 readOnly:cursor-default readOnly:hover:border-border/20",
        (children.props as any).className
      );

      modifiedChildren = React.cloneElement(children as React.ReactElement<any>, {
        className: combinedInputClass,
        "aria-invalid": error ? "true" : "false",
        "aria-required": required ? "true" : "false",
      });
    }
  }

  return (
    <div className={cn("space-y-1.5 flex flex-col justify-start", className)}>
      {/* Field Label */}
      <label className="text-[11px] font-semibold text-white/90 flex items-center justify-between tracking-wide uppercase">
        <span>
          {label}
          {required && (
            <span className="text-danger ml-1 font-bold" aria-hidden="true">
              *
            </span>
          )}
        </span>
      </label>

      {/* Field Input Frame */}
      <div className="relative flex items-center w-full">
        {resolvedIcon && (
          <div className="absolute left-3.5 text-muted/50 pointer-events-none flex items-center justify-center">
            {resolvedIcon}
          </div>
        )}
        
        {modifiedChildren}

        {/* Floating status icons */}
        {error && (
          <div className="absolute right-3.5 text-danger pointer-events-none flex items-center justify-center animate-fade-in">
            <AlertTriangle className="w-4 h-4" />
          </div>
        )}
        {success && !error && (
          <div className="absolute right-3.5 text-success pointer-events-none flex items-center justify-center animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Status descriptions & instructions */}
      {error ? (
        <p className="text-[10px] text-danger font-medium flex items-center gap-1.5 animate-fade-in mt-1">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      ) : helpText ? (
        <p className="text-[10px] text-muted/60 leading-normal pl-0.5">
          {helpText}
        </p>
      ) : null}
    </div>
  );
}

/* ============================================================================
   6. FORMFOOTER COMPONENT
   ============================================================================ */

export interface FormFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function FormFooter({ children, className }: FormFooterProps) {
  return (
    <div 
      className={cn(
        "mt-auto p-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-end gap-3 bg-navy-900/20", 
        className
      )}
    >
      {children}
    </div>
  );
}

/* ============================================================================
   7. ACTIONBUTTONS COMPONENT
   ============================================================================ */

export interface ActionButtonsProps {
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  submitVariant?: "primary" | "danger";
  onSubmit?: (e: React.FormEvent) => void;
}

export function ActionButtons({
  onCancel,
  submitLabel = "Save Changes",
  cancelLabel = "Cancel",
  isSubmitting = false,
  submitVariant = "primary",
  onSubmit,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="w-full sm:w-auto h-11 px-5 rounded-xl border border-border/40 text-xs font-semibold text-muted hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 outline-none focus:ring-1 focus:ring-primary/30"
      >
        {cancelLabel}
      </button>
      <button
        type={onSubmit ? "button" : "submit"}
        onClick={onSubmit}
        disabled={isSubmitting}
        className={cn(
          "w-full sm:w-auto h-11 px-6 rounded-xl text-xs font-semibold text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed outline-none focus:ring-1 focus:ring-primary/40",
          submitVariant === "danger"
            ? "bg-danger hover:bg-danger/90 shadow-danger/10"
            : "bg-primary hover:bg-primary/90 shadow-primary/10"
        )}
      >
        {isSubmitting && (
          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
        )}
        {submitLabel}
      </button>
    </div>
  );
}

/* ============================================================================
   8. EMPTYTABLESTATE COMPONENT
   ============================================================================ */

export interface EmptyTableStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyTableState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyTableStateProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-border/20 rounded-2xl bg-card/20 my-6 animate-fade-in max-w-md mx-auto",
        className
      )}
    >
      {/* Visual illustration slot */}
      <div className="w-16 h-16 rounded-2xl bg-navy-300/20 border border-border/20 flex items-center justify-center text-muted/70 mb-4 animate-pulse-soft">
        {icon || <Search className="w-7 h-7 stroke-[1.5]" />}
      </div>

      {/* Primary header & information details */}
      <h4 className="text-sm font-bold text-white tracking-tight">{title}</h4>
      <p className="text-xs text-muted/60 max-w-sm mt-2 leading-relaxed">{description}</p>

      {/* Secondary trigger action button */}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/10 transition-all duration-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

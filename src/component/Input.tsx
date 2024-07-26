import React from "react";

interface Props {
  label?: string;
  hint?: string;
  errorMessage?: string;
  placeholder?: string;
  helpMessage?: string;
}

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    Props {
  slotLeft?: React.ReactNode;
  slotRight?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      hint,
      errorMessage,
      helpMessage,
      placeholder = "Ketik disini",
      slotLeft,
      slotRight,
      ...props
    },
    ref
  ) => {
    return (
      <label className="form-control w-full">
        {label || helpMessage ? (
          <div className="label">
            <span className="label-text font-bold">{label}</span>
            <span className="label-text-alt">{helpMessage}</span>
          </div>
        ) : (
          ""
        )}
        <div className="flex items-center gap-1 input p-0 input-bordered">
          {slotLeft ? <div className="ps-4">{slotLeft}</div> : ""}
          <input
            type={type}
            placeholder={placeholder}
            className={"input input-ghost grow !border-0 w-full " + className}
            ref={ref}
            {...props}
          />
          {slotRight ? <div className="pe-4">{slotRight}</div> : ""}
        </div>
        <div className="label">
          {hint && <span className="label-text-alt">{hint}</span>}
          {errorMessage && (
            <span className="label-text-alt text-error">{errorMessage}</span>
          )}
        </div>
      </label>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement>,
    Props {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      hint,
      errorMessage,
      helpMessage,
      placeholder = "Ketik disini",
      ...props
    },
    ref
  ) => {
    return (
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text font-bold">{label}</span>
          <span className="label-text-alt">{helpMessage}</span>
        </div>
        <textarea
          placeholder={placeholder}
          className={
            "textarea textarea-bordered w-full min-h-24 max-h-48 " + className
          }
          ref={ref}
          {...props}
        />
        <div className="label">
          {hint && <span className="label-text-alt">{hint}</span>}
          {errorMessage && (
            <span className="label-text-alt text-error">{errorMessage}</span>
          )}
        </div>
      </label>
    );
  }
);
Textarea.displayName = "Textarea";

interface SelectProps<T>
  extends React.InputHTMLAttributes<HTMLSelectElement>,
    Props {
  options: T[];
  keyValue?: string;
  keyDisplay?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps<any>>(
  (
    {
      className,
      label,
      hint,
      errorMessage,
      helpMessage,
      placeholder = "- Pilih -",
      options,
      keyValue,
      keyDisplay,
      ...props
    },
    ref
  ) => {
    return (
      <label className="form-control w-full">
        {label || helpMessage ? (
          <div className="label">
            <span className="label-text font-bold">{label}</span>
            <span className="label-text-alt">{helpMessage}</span>
          </div>
        ) : (
          ""
        )}
        <select
          className={"text-small select select-bordered w-full " + className}
          ref={ref}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option, i) => (
            <option
              key={i}
              className="text-small"
              value={
                typeof option != "string" && keyValue
                  ? option[keyValue]
                  : option
              }
            >
              {typeof option != "string" && keyDisplay
                ? option[keyDisplay]
                : option}
            </option>
          ))}
        </select>
        <div className="label">
          {hint && <span className="label-text-alt">{hint}</span>}
          {errorMessage && (
            <span className="label-text-alt text-error">{errorMessage}</span>
          )}
        </div>
      </label>
    );
  }
);

export { Input, Textarea, Select };

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
    Props {}

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
        <input
          type={type}
          placeholder={placeholder}
          className={"input input-bordered w-full " + className}
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
        {hint || errorMessage ? (
          <div className="label">
            {hint && <span className="label-text-alt">{hint}</span>}
            {errorMessage && (
              <span className="label-text-alt text-error">{errorMessage}</span>
            )}
          </div>
        ) : (
          ""
        )}
      </label>
    );
  }
);

export { Input, Textarea, Select };

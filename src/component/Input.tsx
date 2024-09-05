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
            className={
              (type == "file"
                ? "file-input file-input-ghost"
                : "input input-ghost") +
              " grow !border-0 w-full " +
              className
            }
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
  displayBuilder?: (t: T) => any;
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
      displayBuilder,
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
              {typeof option !== "string"
                ? displayBuilder
                  ? displayBuilder(option)
                  : keyDisplay
                    ? option[keyDisplay]
                    : option
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

interface ToggleProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    Props {
      rowClassName?: string
    }

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      className,
      rowClassName,
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
      <div className="form-control">
        <label className={"label gap-3 cursor-pointer " + rowClassName}>
          <div className="flex flex-col">
            <span className="label-text">{label}</span>
            {hint && <span className="label-text-alt">{hint}</span>}
          </div>
          <div className="flex flex-col items-end justify-end gap-3">
            <input
              type="checkbox"
              className={"toggle toggle-accent toggle-lg " + className}
              name="is_active"
              ref={ref}
              {...props}
            />
            {errorMessage && (
              <span className="label-text-alt text-end text-error">
                {errorMessage}
              </span>
            )}
          </div>
        </label>
      </div>
    );
  }
);
Toggle.displayName = "toggle";

export { Input, Textarea, Select, Toggle };

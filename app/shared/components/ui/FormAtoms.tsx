import { UI_TOKENS } from "../../../shared/theme/ui-tokens";

interface LabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const LabelInput = ({ label, ...props }: LabelInputProps) => (
  <div className="space-y-1.5">
    <label className={UI_TOKENS.label}>{label}</label>
    <input 
      {...props}
      className={`${UI_TOKENS.input} ${props.className || ""}`}
    />
  </div>
);

interface LabelTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const LabelTextArea = ({ label, ...props }: LabelTextAreaProps) => (
  <div className="space-y-1.5">
    <label className={UI_TOKENS.label}>{label}</label>
    <textarea 
      {...props}
      className={`${UI_TOKENS.input} h-24 resize-none ${props.className || ""}`}
    />
  </div>
);

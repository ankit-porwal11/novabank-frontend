import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import Input from "../ui/Input.jsx";

export default function PasswordInput({ label = "Password", ...rest }) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      label={label}
      type={visible ? "text" : "password"}
      leftIcon={<Lock size={16} />}
      rightAdornment={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          style={{
            display: "inline-flex",
            color: "var(--color-text-faint)",
            background: "transparent",
          }}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
      {...rest}
    />
  );
}

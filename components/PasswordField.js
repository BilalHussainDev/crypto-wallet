'use client'
import { useState } from "react";
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function PasswordField({
  name,
  placeholder,
  value,
  error,
  onChange,
  onBlur,
  disabled,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <OutlinedInput
      type={showPassword ? "text" : "password"}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete="password"
      onBlur={onBlur}
      error={error}
      disabled={disabled}
      // Show and Hide Password Button with respective Icon
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={() => setShowPassword((s) => !s)}
            onMouseDown={(e) => e.preventDefault}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
    />
  );
}

export default PasswordField;

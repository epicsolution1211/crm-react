import React, { useState } from "react";
import { useDebouncyEffect } from "use-debouncy";
import { HexColorPicker } from "react-colorful";

export const DebouncedColorPicker = ({ color, onChange }) => {
  const [value, setValue] = useState(color);

  useDebouncyEffect(() => onChange(value), 400, [value]);

  return <HexColorPicker color={color || "#ffffff"} onChange={setValue} />;
};

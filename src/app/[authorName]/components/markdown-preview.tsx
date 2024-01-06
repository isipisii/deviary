"use client";

import { MdPreview, MdCatalog } from "md-editor-rt";
import "md-editor-rt/lib/preview.css";
import { useTheme } from "next-themes";
import type { Themes } from "md-editor-rt";

export default function MarkdownPreview({
  modelValue,
}: {
  modelValue: string;
}) {
  const { theme } = useTheme();

  return (
    <MdPreview
      theme={theme as Themes}
      modelValue={modelValue}
      language="en-US"
      style={{ background: "none" }}
    />
  );
}

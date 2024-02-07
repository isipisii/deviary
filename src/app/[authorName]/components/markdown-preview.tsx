"use client";

import { MdPreview, MdCatalog } from "md-editor-rt";
import "md-editor-rt/lib/preview.css";
import { useTheme } from "next-themes";

export default function MarkdownPreview({
  modelValue,
}: {
  modelValue: string;
}) {
  const { resolvedTheme } = useTheme();

  return (
    <MdPreview
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      modelValue={modelValue}
      language="en-US"
      style={{ background: "none", padding: "0px" }}
    />
  );
}

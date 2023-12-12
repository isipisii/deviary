"use client";

import { MdPreview, MdCatalog, MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { useState } from "react";
import { useTheme } from "next-themes";

import type { Themes } from "md-editor-rt";

export default function MarkdownContainer({ markdown, setValue }: { markdown: string, setValue: (v: string) => void }) {
  const [id] = useState("preview-only");
  const { theme } = useTheme();

  return (
    <div className="w-full">
      <MdEditor
        editorId={id}
        onChange={setValue}
        modelValue={markdown}
        theme={theme as Themes}
        style={{ borderRadius: ".9rem"}}
        language="en-US"
        pageFullscreen={false}
        scrollAuto
        toolbarsExclude={[
          "revoke",
          "next",
          "save",
          "htmlPreview",
          "catalog",
          "github",
        ]}
      />
    </div>
  );
}

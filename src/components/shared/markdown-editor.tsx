"use client";

import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { useState } from "react";
import { useTheme } from "next-themes";

export default function MarkdownEditor({ markdown, setValue }: { markdown: string, setValue: (v: string) => void }) {
  const [id] = useState("preview-only");
  const { resolvedTheme } = useTheme();

  return (
    <div className="w-full">
      <MdEditor
        editorId={id}
        onChange={setValue}
        modelValue={markdown}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
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
        placeholder="Content*"
        onDrop={(e) => {
          e.preventDefault();
          console.log(e.dataTransfer?.files[0]);
        }}
      />
    </div>
  );
}

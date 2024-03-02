import { Prism } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function SyntaxHighlighter({ children }: { children: string }) {
  return (
    <Prism
      language="jsx"
      style={dracula}
      showLineNumbers
      customStyle={{
        fontSize: ".6rem",
        overflow: "auto",
        borderRadius: ".75rem",
        height: "200px",
      }}
    >
      {children}
    </Prism>
  );
}

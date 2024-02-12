import { usePalette } from "@lauriys/react-palette";
import { extractColors } from "extract-colors";
import type { FinalColor } from "extract-colors/lib/types/Color";
import { useEffect, useState } from "react";

export default function useExtractColor(imagePath: string) {
  const [colors, setColors] = useState<FinalColor[]>([]);

  useEffect(() => {
    async function extract() {
      if (!imagePath) {
        setColors([]);
        return;
      }

      extractColors(imagePath, { crossOrigin: "anonymous" })
        .then((resColors) => setColors(resColors))
        .catch(console.error)
    }

    extract();
  }, [imagePath]);

  return colors;
}

// export default function useExtractColor(imagePath: string) {
//   const { data, loading, error } = usePalette(imagePath);
//   const [colors, setColors] = useState<string[]>([]);
  
//   useEffect(() => {
//     let objectColorVal

//     if (!imagePath) {
//       setColors([]);
//       return;
//     } 

//     if(data) {
//       objectColorVal = Object.values(data) 
//     }
//     setColors(objectColorVal as string[]);
//   }, [imagePath, data]);

//   return colors;
// }

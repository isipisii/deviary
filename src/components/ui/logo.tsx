import { useTheme } from "next-themes";
import Image from "next/image";

export default function Logo() {
  const { theme } = useTheme()

  return (
    <Image
        src={theme === "dark" || theme === undefined ? "/images/deviary-dark.png" : "/images/deviary-light.png"}
        alt="logo"
        width={90}
        height={30}
    />
  )
}

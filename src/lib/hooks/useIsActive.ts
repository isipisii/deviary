import { usePathname } from "next/navigation";

export function useIsActive() {
    const pathname = usePathname();
    
    function isActive(href: string) {
       return pathname === href;
    }

    return isActive
}
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function useLogout(onClose: () => void) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    async function handleLogout() {
      try {
        setIsPending(true);
        await signOut();
        setIsPending(false);
        onClose();
        router.push("/sign-in");
      } catch (error) {
        console.log(error);
      }
    }

    return { isPending, handleLogout }
}   
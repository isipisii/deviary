import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { QueryKeys } from "../constants";

export function useGetNotifications() {
    return useQuery({
        queryKey: [QueryKeys.Notifications],
        queryFn: async () => {
            const res = await axios.get("/api/notifications")

            return res.data.notifications
        },
        staleTime: 60 * 1000,
    })
}
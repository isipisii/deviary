"use server";
import { revalidatePath } from "next/cache";

export const updateRoute = async (path: string) => {
  revalidatePath(path);
};
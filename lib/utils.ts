import { auth } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { type ClassValue, clsx } from "clsx";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

import prismadb from "@/lib/prismadb";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Conditionally import the DarkModeSwitch component only on the client side
export const DynamicDarkModeSwitch = dynamic(
  () => import("@/components/DarkModeSwitch"),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);

export const getUserId = async () => {
  const { userId } = auth();
  if (!userId) {
    return null;
  } else return userId;
};

export const getStoreByUserAndStoreIds = async (
  storeId: string,
  userId: string
) => {
  try {
    const store = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });
    return store || null;
  } catch (error) {
    //toast.error("Error finding store");
    return null;
  }
};
export const getStoreByStoreId = async (storeId: string) => {
  try {
    const store = await prismadb.store.findFirst({
      where: {
        id: storeId,
      },
    });
    return store || null;
  } catch (error) {
    //toast.error("Error finding store");
    return null;
  }
};
export const getBillboardByBillboardId = async (billboardId: string) => {
  try {
    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });
    return billboard || null;
  } catch (error) {
    //toast.error("Error finding billboard");
    return null;
  }
};
export const getCategoriesByCategoryId = async (categoryId: string) => {
  try {
    const billboard = await prismadb.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    return billboard || null;
  } catch (error) {
    //toast.error("Error finding billboard");
    return null;
  }
};

export const getStoreByUserId = async (userId: string) => {
  try {
    const store = await prismadb.store.findFirst({
      where: {
        userId,
      },
    });
    return store || null;
  } catch (error) {
    //toast.error("Error finding store");
    return null;
  }
};
export const getAllStoresByUserId = async (userId: string) => {
  try {
    const store = await prismadb.store.findMany({
      where: {
        userId,
      },
    });
    return store;
  } catch (error) {
    return [];
    //toast.error("Error finding store");
  }
};
export const getAllBillboardsByStoreId = async (
  storeId: string,
  orderBy: "asc" | "desc" = "desc"
) => {
  try {
    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId,
      },
      orderBy: {
        createdAt: orderBy,
      },
    });
    return billboards;
  } catch (error) {
    return [];
    //toast.error("Error finding store");
  }
};
export const getAllCategoriesByStoreId = async (
  storeId: string,
  orderBy: "asc" | "desc" = "desc"
) => {
  try {
    const categories = await prismadb.category.findMany({
      where: {
        storeId,
      },
      include: {
        billboard: true,
      },
      orderBy: {
        createdAt: orderBy,
      },
    });
    return categories;
  } catch (error) {
    return [];
    //toast.error("Error finding store");
  }
};

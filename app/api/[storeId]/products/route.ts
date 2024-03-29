import prismadb from "@/lib/prismadb";
import { getAllProductsByStoreId, getStoreByUserId } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("name required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Price required", { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse("Images required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("Category required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("Size required", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("Color required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Store ID Required", { status: 400 });
    }

    const storeByUserId = await getStoreByUserId(userId);
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images?.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return new NextResponse("API Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}

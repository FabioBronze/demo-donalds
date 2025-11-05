import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import ProductDetails from "./components/productDetails";
import ProductHeader from "./components/productsHeader";

interface ProductPageProps {
  params: Promise<{ slug: string; productId: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId } = await params;
  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      restaurant: {
        select: {
          name: true,
          avatarImageUrl: true,
        },
      },
    },
  });

  if (!product) {
    return notFound();
  }
  return (
    <>
      <ProductHeader product={product} />
      <ProductDetails product={product} />
    </>
  );
};

export default ProductPage;

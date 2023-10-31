import { getProductByProductId } from "@/lib/utils";
import ProductForm from "./components/product-form";

const ProductPage = async ({ params }: { params: { productId: string } }) => {
  const product = await getProductByProductId(params.productId);
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductForm initialData={product} />
      </div>
    </div>
  );
};

export default ProductPage;
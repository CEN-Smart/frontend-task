import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "../query/fetch-products";
import { useParams } from "react-router-dom";
import PageLoading from "../components/page-load-data";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { useProductStore } from "./../store/product";

const Product = () => {
  const { productId = "" } = useParams();
  const addToCart = useProductStore((state) => state.addProduct);
  const { data, isFetching, isPending, isError, error } = useQuery({
    queryKey: ["product", { productId }],
    queryFn: () => fetchProduct(productId),
    staleTime: 1000 * 60 * 5,
  });
  if (isFetching || isPending) {
    return <PageLoading />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const handleAddToCart = () => {
    addToCart(data);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <img
            src={data.image}
            alt={data.title}
            className="w-full max-h-[320px] object-scale-down "
          />
        </div>
        <div>
          <h1
            className={cn(
              `
            text-xl
            font-bold
            text-gray-800
            uppercase
            mb-2
          `,
              {
                "text-green-600": data.category === "women's clothing",
                "text-blue-600": data.category === "jewelery",
                "text-yellow-600": data.category === "electronics",
                "text-red-600": data.category === "men's clothing",
              }
            )}
          >
            {data.category}
          </h1>
          <p className="text-gray-600">{data.description}</p>
          {/* title */}
          <h2 className="text-xl font-bold mt-4">{data.title}</h2>
          {/* price */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(data.price)}
            </p>
            <Button variant="outline" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
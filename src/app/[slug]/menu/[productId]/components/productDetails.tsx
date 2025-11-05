import { Prisma } from "@prisma/client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers/format-currency";

interface ProductDetailsProps {
    product: Prisma.ProductGetPayload<{
        include: {
            restaurant: {
                select: {
                    name: true;
                    avatarImageUrl: true;
                };
            };
        };
    }>;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
    return (
        <div className="relative p-5 z-50 rounded-t-3xl py-5 mt-[-1.5rem]">
            <div className="flex items-center gap-1.5 ">
                <Image src={product.restaurant.avatarImageUrl} alt={product.restaurant.name} width={16} height={16} className="rounded-full" />
                <p className="text-xs text-muted-foreground">{product.restaurant.name}</p>
            </div>
            <h2 className="text-xl font-semibold mt-1">{product.name}</h2>
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold">{formatCurrency(product.price)}</h3>
                <div className="flex items-center gap-3 text-center">
                    <Button variant="outline" className="h-8 w-8 rounded-xl"><ChevronLeftIcon /></Button>
                    <p className="w-4">12</p>
                    <Button variant="destructive" className="h-8 w-8 rounded-xl"><ChevronRightIcon /></Button>
                </div>
            </div>
        </div >
    );
}

export default ProductDetails;
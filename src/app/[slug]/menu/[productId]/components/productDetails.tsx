"use client"
import { Prisma } from "@prisma/client";
import { ChefHatIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/helpers/format-currency";

import { CartContext } from "../../context/cart";
import CartSheet from "./cartSheet";

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
    const { toggleCart, addProduct } = useContext(CartContext)
    const [quantity, setQuantity] = useState<number>(1)
    const handleRightClick = () => {
        setQuantity((prev) => prev + 1)
    }
    const handleLeftClick = () => {
        setQuantity((prev) => {
            if (prev === 1) {
                return 1
            }
            return prev - 1
        })
    }
    const handleAddToCart = () => {
        addProduct({
            ...product,
            quantity
        })
        toggleCart()
    }

    return (
        <>
            <div className="relative p-5 z-50 rounded-t-3xl py-5 mt-[-1.5rem] flex-auto flex flex-col overflow-hidden">
                <div className="flex-auto overflow-hidden">
                    <div className="flex items-center gap-1.5 ">
                        <Image src={product.restaurant.avatarImageUrl} alt={product.restaurant.name} width={16} height={16} className="rounded-full" />
                        <p className="text-xs text-muted-foreground">{product.restaurant.name}</p>
                    </div>
                    <h2 className="text-xl font-semibold mt-1">{product.name}</h2>
                    <div className="mt-3 flex items-center justify-between">
                        <h3 className="text-xs font-semibold">{formatCurrency(product.price)}</h3>
                        <div className="flex items-center gap-3 text-center">
                            <Button onClick={handleLeftClick} variant="outline" className="h-8 w-8 rounded-xl"><ChevronLeftIcon /></Button>
                            <p className="w-4">{quantity}</p>
                            <Button onClick={handleRightClick} variant="destructive" className="h-8 w-8 rounded-xl"><ChevronRightIcon /></Button>
                        </div>
                    </div>
                    <ScrollArea className="h-full">
                        <div className="mt-6 space-y-3">
                            <h4 className="font-semibold">About</h4>
                            <p className="text-sm text-muted-foreground">{product.description}</p>
                        </div>
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-1.5">
                                <ChefHatIcon size={18} />
                            </div>
                            <ul className="list-disc px-5 text-sm text-muted-foreground">
                                {product.ingredients.map((ingredient) => (
                                    <li key={ingredient}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                    </ScrollArea>
                </div>
                <Button onClick={handleAddToCart} className="rounded-full w-full">Add to Cart</Button>
                <CartSheet />
            </div >
        </>);
}

export default ProductDetails;
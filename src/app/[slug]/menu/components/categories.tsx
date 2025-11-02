import { Prisma } from "@prisma/client";
import { GlobeLockIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CategoriesProps {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      menuCategories: {
        include: { products: true }; //Necessário para o Prisma saber que nesta página estamos a trazer as categories e products.
      };
    };
  }>;
}

const Categories = ({ restaurant }: CategoriesProps) => {
    return (
    <div className="relative z-50 mt-[-1.5rem] rounded-t-3xl border bg-white">
      <div className="p-5">
        <div className="flex items-center gap-3">
        <Image
          src={restaurant.avatarImageUrl}
          alt={restaurant.name}
          height={45}
          width={45}
        />
        <div>
          <h2 className="text-lg font-semibold">{restaurant.name}</h2>
          <p className="text-xs opacity-55">{restaurant.description}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs text-green-500">
        <GlobeLockIcon size={12} />
        <p>Open!</p>
      </div>
      </div>
      <ScrollArea className="w-full">
        <div className="flex w-max space-x-4 p-4 pt-0">
          {restaurant.menuCategories.map (category => (
          <Button key={category.id} variant="secondary" size="sm" className="rounded-full">
            {category.name}
          </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default Categories;

"use client";

import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartActions, useCartItem } from "@/lib/store/cart-store-provider";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
  className?: string;
}

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  stock,
  className,
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCartActions();
  const cartItem = useCartItem(productId);

  const quantityInCart = cartItem?.quantity ?? 0;
  const isOutOfStock = stock <= 0;

  const handleAdd = () => {
    if (quantityInCart === 0) {
      addItem({ productId, name, price, image }, 1);
      toast.success(`Added ${name}`);
    }
    openCart();
  };

  // Out of stock
  if (isOutOfStock) {
    return (
      <Button
        disabled
        variant="secondary"
        className={cn("h-11 w-full", className)}
      >
        Out of Stock
      </Button>
    );
  }

  return (
    <Button onClick={handleAdd} className={cn("h-11 w-full", className)}>
      <ShoppingBag className="mr-2 h-4 w-4" />
      Inquire Now
    </Button>
  );
}

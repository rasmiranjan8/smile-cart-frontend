import { assoc, dissoc, evolve } from "ramda";
import { create } from "zustand";
import { isNotEmpty } from "neetocist";
import { persist } from "zustand/middleware";

const useCartItemsStore = create(
  persist(
    set => ({
      cartItems: {},

      setSelectedQuantity: (slug, quantity) =>
        set(({ cartItems }) => {
          if (quantity <= 0 && isNotEmpty(quantity)) {
            return { cartItems: dissoc(slug, cartItems) };
          }
          return { cartItems: assoc(slug, String(quantity), cartItems) };
        }),

      removeCartItem: slug =>
        set(({ cartItems }) => ({
          cartItems: dissoc(slug, cartItems),
        })),
    }),
    { name: "cart-items-store" }
  )
);

export default useCartItemsStore;

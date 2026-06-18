"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/components/CartContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const priceFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

export default function CartPage() {
  const router = useRouter();
  const { items, totalPrice, removeFromCart, clearCart } = useCart();

  const [notification, setNotification] = useState("");
  const [couponCode, setCouponCode]     = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError]   = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [discount, setDiscount] = useState<{
    type: string;
    value: number;
    code: string;
  } | null>(null);

  // Calculate discounted total
  const discountedTotal = discount
    ? discount.type === "percent"
      ? totalPrice - (totalPrice * discount.value) / 100
      : Math.max(0, totalPrice - discount.value)
    : totalPrice;

  // Apply coupon — calls backend to validate
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch(`${API_URL}/api/public/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setCouponError(json.detail || "Invalid coupon code");
        setDiscount(null);
        setCouponApplied(false);
      } else {
        setDiscount({
          type:  json.data.discount_type,
          value: json.data.discount_value,
          code:  json.data.code,
        });
        setCouponApplied(true);
        setCouponError("");
      }
    } catch (e) {
      setCouponError("Could not validate coupon. Try again.");
    } finally {
      setCouponLoading(false);
    }
  };

  // Buy now — save to localStorage + increment coupon usage
  const handleBuyNow = async () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("edu_purchased_bundles");
      let list: any[] = [];
      try {
        list = stored ? JSON.parse(stored) : [];
      } catch (e) {}

      items.forEach((item) => {
        if (!list.some((existing: any) => existing.id === item.id)) {
          list.push({
            id:       item.id,
            title:    item.title,
            subtitle: item.subtitle,
            price:    item.price,
          });
        }
      });

      localStorage.setItem("edu_purchased_bundles", JSON.stringify(list));
    }

    // Increment coupon used count in backend
    if (discount) {
      try {
        await fetch(`${API_URL}/api/public/coupons/use`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: discount.code }),
        });
      } catch (e) {}
    }

    clearCart();
    setNotification("Purchase successful! Redirecting to your dashboard...");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-[120px] pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#6366F1] font-semibold">Shopping Cart</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-serif font-bold text-[#0F172A]">
              Your selected courses
            </h1>
            <p className="mt-3 text-base text-[#475569] max-w-2xl font-sans">
              Review the items you added, remove any bundle you don't need, and complete your purchase with one click.
            </p>
          </div>
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm w-full md:w-auto">
            <p className="text-sm text-[#64748B]">Cart summary</p>
            <p className="mt-3 text-3xl font-bold text-[#0F172A]">{priceFormatter.format(totalPrice)}</p>
            <p className="mt-2 text-sm text-[#64748B]">{items.length} items</p>
          </div>
        </div>

        {/* Success Notification */}
        {notification && (
          <div className="mb-8 rounded-3xl border border-green-200 bg-green-50 p-5 text-green-800 font-sans font-semibold text-center">
            {notification}
          </div>
        )}

        {/* Empty Cart */}
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#CBD5E1] bg-white p-10 text-center">
            <ShoppingBag size={42} className="mx-auto text-[#6366F1] mb-4" />
            <h2 className="text-2xl font-semibold text-[#0F172A] mb-2">Your cart is empty</h2>
            <p className="text-[#64748B] mb-6">Add a course bundle from the Courses page to get started.</p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#6366F1] text-white font-semibold hover:bg-indigo-600 transition-colors"
            >
              Browse Courses
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">

            {/* Cart Items */}
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.26em] text-[#6366F1] font-semibold">
                        {item.subject}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold text-[#0F172A]">{item.title}</h3>
                      <p className="mt-2 text-sm text-[#475569] max-w-xl">{item.subtitle}</p>
                    </div>
                    <div className="flex items-end justify-between gap-4 sm:justify-end">
                      <div className="text-right">
                        <p className="text-sm text-[#64748B]">Price</p>
                        <p className="mt-1 text-3xl font-bold text-[#0F172A]">
                          {priceFormatter.format(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#475569] hover:border-[#A5B4FC] hover:text-[#3730A3] transition-colors"
                      >
                        <Trash2 size={16} className="inline-block mr-2" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
              <p className="text-sm text-[#64748B] uppercase tracking-[0.18em] font-semibold mb-4">
                Order summary
              </p>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm text-[#475569]">
                  <span>Items total</span>
                  <span>{priceFormatter.format(totalPrice)}</span>
                </div>

                {discount && (
                  <div className="flex items-center justify-between text-sm text-[#16A34A] font-semibold">
                    <span>Discount ({discount.code})</span>
                    <span>
                      -{discount.type === "percent"
                        ? `${discount.value}%`
                        : priceFormatter.format(discount.value)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-[#475569]">
                  <span>Delivery</span>
                  <span className="text-[#10B981]">Free</span>
                </div>

                <div className="border-t border-[#E2E8F0] pt-3 flex items-center justify-between text-lg font-bold text-[#0F172A]">
                  <span>Total</span>
                  <span>{priceFormatter.format(discountedTotal)}</span>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="border-t border-[#E2E8F0] pt-6 font-sans">
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                  Have a coupon code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME15"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={couponApplied}
                    className="flex-grow px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#6366F1] disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || couponApplied}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {couponLoading ? "..." : couponApplied ? "Applied ✓" : "Apply"}
                  </button>
                </div>

                {/* Coupon success message */}
                {couponApplied && discount && (
                  <p className="mt-2 text-xs font-semibold text-[#16A34A]">
                    ✅ Coupon applied! You save{" "}
                    {discount.type === "percent"
                      ? `${discount.value}%`
                      : priceFormatter.format(discount.value)}
                  </p>
                )}

                {/* Coupon error message */}
                {couponError && (
                  <p className="mt-2 text-xs font-semibold text-red-500">
                    ❌ {couponError}
                  </p>
                )}

                {/* Remove coupon */}
                {couponApplied && (
                  <button
                    onClick={() => {
                      setDiscount(null);
                      setCouponApplied(false);
                      setCouponCode("");
                      setCouponError("");
                    }}
                    className="mt-2 text-xs text-gray-400 hover:text-red-500 underline transition-colors"
                  >
                    Remove coupon
                  </button>
                )}
              </div>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                className="mt-6 w-full rounded-2xl bg-[#6366F1] px-5 py-4 text-white font-semibold hover:bg-indigo-600 transition-colors"
              >
                Buy Now
              </button>

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="mt-4 w-full rounded-2xl border border-[#E2E8F0] px-5 py-4 text-sm font-semibold text-[#475569] hover:border-[#6366F1] hover:text-[#6366F1] transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}











// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";
// import { useCart } from "@/components/CartContext";

// const priceFormatter = new Intl.NumberFormat("en-AU", {
//   style: "currency",
//   currency: "AUD",
//   maximumFractionDigits: 0,
// });

// export default function CartPage() {
//   const router = useRouter();
//   const { items, totalPrice, removeFromCart, clearCart } = useCart();
//   const [notification, setNotification] = useState("");
//   const [couponCode, setCouponCode] = useState("");
//   const [couponApplied, setCouponApplied] = useState(false);
//   const [couponError, setCouponError] = useState("");
//   const [couponLoading, setCouponLoading] = useState(false);
//   const [discount, setDiscount] = useState<{ type: string; value: number; code: string } | null>(null);

// const discountedTotal = discount
//   ? discount.type === "percent"
//     ? totalPrice - (totalPrice * discount.value) / 100
//     : Math.max(0, totalPrice - discount.value)
//   : totalPrice;

//   const handleApplyCoupon = async () => {
//   if (!couponCode.trim()) return;
//   setCouponLoading(true);
//   setCouponError("");
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/public/coupons/validate`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ code: couponCode.trim() }),
//       }
//     );
//     const json = await res.json();
//     if (!res.ok) {
//       setCouponError(json.detail || "Invalid coupon code");
//       setDiscount(null);
//       setCouponApplied(false);
//     } else {
//       setDiscount({
//         type: json.data.discount_type,
//         value: json.data.discount_value,
//         code: json.data.code,
//       });
//       setCouponApplied(true);
//       setCouponError("");
//     }
//   } catch (e) {
//     setCouponError("Could not validate coupon. Try again.");
//   } finally {
//     setCouponLoading(false);
//   }
// };

//   const handleBuyNow = async () => {
//   if (typeof window !== "undefined") {
//     const stored = localStorage.getItem("edu_purchased_bundles");
//     let list = [];
//     try {
//       list = stored ? JSON.parse(stored) : [];
//     } catch (e) {}

//     items.forEach((item) => {
//       if (!list.some((existing: any) => existing.id === item.id)) {
//         list.push({
//           id: item.id,
//           title: item.title,
//           subtitle: item.subtitle,
//           price: item.price,
//         });
//       }
//     });

//     localStorage.setItem("edu_purchased_bundles", JSON.stringify(list));
//   }

//   // Increment coupon used count
//   if (discount) {
//     await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/public/coupons/use`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ code: discount.code }),
//       }
//     );
//   }

//   clearCart();
//   setNotification("Purchase successful! Redirecting to your dashboard...");
//   window.scrollTo({ top: 0, behavior: "smooth" });

//   setTimeout(() => {
//     router.push("/dashboard");
//   }, 2000);
// };
      
//   // Save purchased bundles
//   items.forEach((item) => {
//     if (!list.some((existing: any) => existing.id === item.id)) {
//       list.push({
//         id: item.id,
//         title: item.title,
//         subtitle: item.subtitle,
//         price: item.price,
//       });
//     }
//   });

//       localStorage.setItem("edu_purchased_bundles", JSON.stringify(list));
//     }

//   clearCart();
//   setNotification("Purchase successful! Redirecting to your dashboard...");
//     window.scrollTo({ top: 0, behavior: "smooth" });

//     setTimeout(() => {
//       router.push("/dashboard");
//     }, 2000);
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pt-[120px] pb-24">
//       <div className="container mx-auto px-4 md:px-8 max-w-7xl">
//         <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-10">
//           <div>
//             <p className="text-sm uppercase tracking-[0.3em] text-[#6366F1] font-semibold">Shopping Cart</p>
//             <h1 className="mt-3 text-4xl md:text-5xl font-serif font-bold text-[#0F172A]">
//               Your selected courses
//             </h1>
//             <p className="mt-3 text-base text-[#475569] max-w-2xl font-sans">
//               Review the items you added, remove any bundle you don’t need, and complete your purchase with one click.
//             </p>
//           </div>
//           <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm w-full md:w-auto">
//             <p className="text-sm text-[#64748B]">Cart summary</p>
//             <p className="mt-3 text-3xl font-bold text-[#0F172A]">{priceFormatter.format(totalPrice)}</p>
//             <p className="mt-2 text-sm text-[#64748B]">{items.length} items</p>
//           </div>
//         </div>

//         {notification ? (
//           <div className="mb-8 rounded-3xl border border-green-200 bg-green-50 p-5 text-green-800 font-sans font-semibold text-center">
//             {notification}
//           </div>
//         ) : null}

//         {items.length === 0 ? (
//           <div className="rounded-3xl border border-dashed border-[#CBD5E1] bg-white p-10 text-center">
//             <ShoppingBag size={42} className="mx-auto text-[#6366F1] mb-4" />
//             <h2 className="text-2xl font-semibold text-[#0F172A] mb-2">Your cart is empty</h2>
//             <p className="text-[#64748B] mb-6">Add a course bundle from the Courses page to get started.</p>
//             <Link
//               href="/courses"
//               className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#6366F1] text-white font-semibold hover:bg-indigo-600 transition-colors"
//             >
//               Browse Courses
//               <ArrowRight size={18} />
//             </Link>
//           </div>
//         ) : (
//           <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
//             <div className="space-y-6">
//               {items.map((item) => (
//                 <div key={item.id} className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
//                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                     <div>
//                       <p className="text-xs uppercase tracking-[0.26em] text-[#6366F1] font-semibold">
//                         {item.subject}
//                       </p>
//                       <h3 className="mt-3 text-2xl font-semibold text-[#0F172A]">{item.title}</h3>
//                       <p className="mt-2 text-sm text-[#475569] max-w-xl">{item.subtitle}</p>
//                     </div>
//                     <div className="flex items-end justify-between gap-4 sm:justify-end">
//                       <div className="text-right">
//                         <p className="text-sm text-[#64748B]">Price</p>
//                         <p className="mt-1 text-3xl font-bold text-[#0F172A]">{priceFormatter.format(item.price)}</p>
//                       </div>
//                       <button
//                         onClick={() => removeFromCart(item.id)}
//                         className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#475569] hover:border-[#A5B4FC] hover:text-[#3730A3] transition-colors"
//                       >
//                         <Trash2 size={16} className="inline-block mr-2" /> Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
//               <p className="text-sm text-[#64748B] uppercase tracking-[0.18em] font-semibold mb-4">Order summary</p>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between text-sm text-[#475569]">
//                   <span>Items total</span>
//                   <span>{priceFormatter.format(totalPrice)}</span>
//                 </div>
//                 {couponApplied && discount && (
//                   <p className="mt-2 text-xs font-semibold text-[#10B981]">
//                     ✅ Coupon applied! You save{" "}
//                     {discount.type === "percent"
//                     ? `${discount.value}%`
//                     : priceFormatter.format(discount.value)}
//                   </p>
//                 )}
//                 {couponError && (
//                   <p className="mt-2 text-xs font-semibold text-red-500">
//                     ❌ {couponError}
//                   </p>
//                 )}
//                 <div className="flex items-center justify-between text-sm text-[#475569]">
//                   <span>Delivery</span>
//                   <span className="text-[#10B981]">Free</span>
//                 </div>
//                 <div className="border-t border-[#E2E8F0] pt-4 flex items-center justify-between text-lg font-semibold text-[#0F172A]">
//                   <span>Total</span>
//                   <span>{priceFormatter.format(discountedTotal)}</span>
//                 </div>
//               </div>

//               {/* Coupon Code Input Area (UI Only) */}
//               <div className="mt-6 border-t border-[#E2E8F0] pt-6 font-sans">
//                 <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
//                   Have a coupon code?
//                 </label>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     placeholder="e.g. WELCOME10"
//                     value={couponCode}
//                     onChange={(e) => setCouponCode(e.target.value)}
//                     className="flex-grow px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleApplyCoupon}
//                     className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors border border-slate-200"
//                   >
//                     Apply
//                   </button>
//                 </div>
                
//                 {couponApplied && discount && (
//                   <p className="mt-2 text-xs font-semibold text-[#10B981]">
//                     ✅ Coupon applied! You save{" "}
//                     {discount.type === "percent"
//                     ? `${discount.value}%`
//                     : priceFormatter.format(discount.value)}
//                   </p>
//                 )}
//                 {couponError && (
//                   <p className="mt-2 text-xs font-semibold text-red-500">
//                     ❌ {couponError}
//                   </p>
//                 )}
//                 </div>

//               <button
//                 onClick={handleBuyNow}
//                 className="mt-8 w-full rounded-2xl bg-[#6366F1] px-5 py-4 text-white font-semibold hover:bg-indigo-600 transition-colors"
//               >
//                 Buy Now
//               </button>

//               <button
//                 onClick={clearCart}
//                 className="mt-4 w-full rounded-2xl border border-[#E2E8F0] px-5 py-4 text-sm font-semibold text-[#475569] hover:border-[#6366F1] hover:text-[#6366F1] transition-colors"
//               >
//                 Clear Cart
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

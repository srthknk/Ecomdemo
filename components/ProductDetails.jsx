'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const ProductDetails = ({ product }) => {

    const productId = product.id;
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

    const cart = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();

    const router = useRouter()

    const [mainImage, setMainImage] = useState(product.images[0]);
    const [selectedSize, setSelectedSize] = useState(null);

    const isClothing = product.isClothing;
    const isOutOfStock = !product.inStock;

    const addToCartHandler = () => {
        if (isClothing && !selectedSize) {
            toast.error('Please select a size')
            return
        }
        dispatch(addToCart({ productId, selectedSize }))
    }

    const averageRating = product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length;
    
    return (
        <div className="flex max-lg:flex-col gap-12">
            <div className="flex max-sm:flex-col-reverse gap-3">
                <div className="flex sm:flex-col gap-3">
                    {product.images.map((image, index) => (
                        <div key={index} onClick={() => setMainImage(product.images[index])} className="bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer">
                            <Image src={image} className="group-hover:scale-103 group-active:scale-95 transition" alt="" width={45} height={45} />
                        </div>
                    ))}
                </div>
                <div className={`flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg relative ${isOutOfStock ? 'opacity-60' : ''}`}>
                    <Image src={mainImage} alt="" width={250} height={250} />
                    {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                            <div className="text-center">
                                <p className="text-white font-bold text-lg">Out of Stock</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-800">{product.name}</h1>
                <div className='flex items-center mt-2'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                    ))}
                    <p className="text-sm ml-3 text-slate-500">{product.rating.length} Reviews</p>
                </div>

                {/* Out of Stock Alert */}
                {isOutOfStock && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                        <AlertCircle size={18} className="text-red-600" />
                        <p className="text-sm text-red-700 font-medium">This product is currently out of stock</p>
                    </div>
                )}

                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
                    <p> {currency}{product.price} </p>
                    <p className="text-xl text-slate-500 line-through">{currency}{product.mrp}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                    <TagIcon size={14} />
                    <p>Save {((product.mrp - product.price) / product.mrp * 100).toFixed(0)}% right now</p>
                </div>

                {/* Size Selector for Clothing */}
                {isClothing && product.productSizes && (
                    <div className="mt-8">
                        <label className="text-sm font-semibold text-slate-800 block mb-3">
                            Select Size <span className="text-red-600">*</span>
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {product.productSizes.map((ps) => {
                                const isSizeOutOfStock = ps.availableUnits === 0;
                                return (
                                    <button
                                        key={ps.size}
                                        onClick={() => !isSizeOutOfStock && setSelectedSize(ps.size)}
                                        disabled={isSizeOutOfStock || isOutOfStock}
                                        className={`py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                                            selectedSize === ps.size
                                                ? 'bg-slate-800 text-white ring-2 ring-slate-400'
                                                : isSizeOutOfStock
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        {ps.size}
                                        {isSizeOutOfStock && <span className="text-xs block">(Out)</span>}
                                    </button>
                                );
                            })}
                        </div>
                        {selectedSize && (
                            <p className="text-xs text-slate-500 mt-2">
                                Size {selectedSize} selected
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-end gap-5 mt-10">
                    {
                        cart[selectedSize ? `${productId}-${selectedSize}` : productId] && (
                            <div className="flex flex-col gap-3">
                                <p className="text-lg text-slate-800 font-semibold">Quantity</p>
                                <Counter productId={productId} selectedSize={selectedSize} />
                            </div>
                        )
                    }
                    <button 
                        onClick={() => !cart[selectedSize ? `${productId}-${selectedSize}` : productId] ? addToCartHandler() : router.push('/cart')} 
                        disabled={isOutOfStock && !cart[selectedSize ? `${productId}-${selectedSize}` : productId]}
                        className={`px-10 py-3 text-sm font-medium rounded active:scale-95 btn-animate transition-all duration-300 ${
                            isOutOfStock && !cart[selectedSize ? `${productId}-${selectedSize}` : productId]
                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                : 'bg-slate-800 text-white hover:bg-slate-900'
                        }`}
                    >
                        {isOutOfStock && !cart[selectedSize ? `${productId}-${selectedSize}` : productId] ? 'Out of Stock' : !cart[selectedSize ? `${productId}-${selectedSize}` : productId] ? 'Add to Cart' : 'View Cart'}
                    </button>
                </div>
                <hr className="border-gray-300 my-5" />
                <div className="flex flex-col gap-4 text-slate-500">
                    <p className="flex gap-3"> <EarthIcon className="text-slate-400" /> Free shipping worldwide </p>
                    <p className="flex gap-3"> <CreditCardIcon className="text-slate-400" /> 100% Secured Payment </p>
                    <p className="flex gap-3"> <UserIcon className="text-slate-400" /> Trusted by top brands </p>
                </div>

            </div>
        </div>
    )
}

export default ProductDetails
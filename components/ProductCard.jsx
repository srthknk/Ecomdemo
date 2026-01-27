'use client'
import { StarIcon, AlertCircle, Eye, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const ProductCard = ({ product }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'
    const [isFavorite, setIsFavorite] = useState(false)

    // calculate the average rating of the product
    const rating = product.rating?.length > 0 ? Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length) : 0;
    
    const outOfStock = product.totalUnits === 0
    const lowStock = product.totalUnits > 0 && product.totalUnits <= 10
    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100)

    return (
        <Link href={`/product/${product.id}`} className={`group max-xl:mx-auto w-full`}>
            <div className={`relative bg-gradient-to-br from-slate-100 to-slate-50 h-32 sm:h-48 md:h-56 lg:h-64 w-full rounded-lg flex items-center justify-center overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 ${outOfStock ? 'opacity-60' : ''}`}>
                {/* Hover Overlay */}
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 z-10' />
                
                <Image 
                    width={500} 
                    height={500} 
                    className='max-h-24 sm:max-h-32 md:max-h-40 lg:max-h-48 w-auto group-hover:scale-110 transition-transform duration-300' 
                    src={product.images[0]} 
                    alt={product.name}
                />
                
                {/* Discount Badge */}
                {discount > 0 && !outOfStock && (
                    <div className='absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg'>
                        -{discount}%
                    </div>
                )}
                
                {/* Stock Status */}
                {outOfStock && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg'>
                        <div className='text-center'>
                            <AlertCircle size={32} className='text-white mx-auto mb-2' />
                            <p className='text-white font-bold text-sm'>Out of Stock</p>
                        </div>
                    </div>
                )}
                
                {lowStock && !outOfStock && (
                    <div className='absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg animate-pulse'>
                        Low Stock
                    </div>
                )}

                {/* Quick Actions on Hover */}
                {!outOfStock && (
                    <div className='absolute bottom-0 left-0 right-0 flex gap-2 p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-full group-hover:translate-y-0'>
                        <button 
                            onClick={(e) => {
                                e.preventDefault()
                                setIsFavorite(!isFavorite)
                            }}
                            className='flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 py-2 rounded-lg font-medium text-xs transition-all duration-300 active:scale-95'
                        >
                            <Heart size={16} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
                            <span className='hidden sm:inline'>Wishlist</span>
                        </button>
                        <button 
                            onClick={(e) => e.preventDefault()}
                            className='flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium text-xs transition-all duration-300 active:scale-95'
                        >
                            <Eye size={16} />
                            <span className='hidden sm:inline'>Quick View</span>
                        </button>
                    </div>
                )}
            </div>
            
            {/* Product Info */}
            <div className='flex flex-col gap-1.5 text-xs sm:text-sm text-slate-800 pt-3 w-full'>
                <p className='line-clamp-2 font-medium group-hover:text-indigo-600 transition-colors duration-300'>{product.name}</p>
                
                {/* Rating */}
                <div className='flex items-center gap-1'>
                    <div className='flex gap-0.5'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={12} className='text-transparent' fill={rating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                        ))}
                    </div>
                    <span className='text-xs text-slate-500'>({product.rating?.length || 0})</span>
                </div>
                
                {/* Price */}
                <div className='flex items-center gap-2'>
                    <p className='font-bold text-green-600'>{currency}{product.price}</p>
                    {product.mrp > product.price && (
                        <p className='text-xs text-slate-400 line-through'>{currency}{product.mrp}</p>
                    )}
                </div>
                
                {/* Clothing Info */}
                {product.isClothing && (
                    <p className='text-xs text-indigo-600 font-medium'>Available in multiple sizes</p>
                )}
            </div>
        </Link>
    )
}

export default ProductCard
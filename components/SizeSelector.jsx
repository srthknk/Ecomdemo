'use client'
import { useState } from "react"
import { AlertCircle } from "lucide-react"

export default function SizeSelector({ product, onSizeSelect, selectedSize }) {
    const [selectedVariant, setSelectedVariant] = useState(selectedSize || '')

    const handleSizeChange = (size) => {
        setSelectedVariant(size)
        onSizeSelect(size)
    }

    if (!product.isClothing) {
        return null
    }

    const outOfStock = product.totalUnits === 0

    return (
        <div className="my-6 p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">Select Size</h3>
                {outOfStock && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-red-100 rounded-full">
                        <AlertCircle size={14} className="text-red-600" />
                        <span className="text-xs font-semibold text-red-600">Out of Stock</span>
                    </div>
                )}
            </div>

            {outOfStock ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                    <p className="text-red-600 font-medium text-sm">This product is currently out of stock</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {product.productSizes && product.productSizes.map((sizeOption) => {
                        const isAvailable = sizeOption.availableUnits > 0
                        const isLowStock = isAvailable && sizeOption.availableUnits <= 3
                        const isSelected = selectedVariant === sizeOption.size

                        return (
                            <button
                                key={sizeOption.id}
                                onClick={() => isAvailable && handleSizeChange(sizeOption.size)}
                                disabled={!isAvailable}
                                className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                                    isSelected
                                        ? 'border-green-600 bg-green-50'
                                        : isAvailable
                                        ? 'border-slate-200 bg-white hover:border-slate-300'
                                        : 'border-slate-100 bg-slate-50 cursor-not-allowed'
                                }`}
                            >
                                <span className={`font-medium ${
                                    isSelected ? 'text-green-700' : isAvailable ? 'text-slate-700' : 'text-slate-400'
                                }`}>
                                    Size {sizeOption.size}
                                </span>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                    !isAvailable
                                        ? 'bg-slate-200 text-slate-600'
                                        : isLowStock
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'bg-green-100 text-green-700'
                                }`}>
                                    {isAvailable ? `${sizeOption.availableUnits} in stock${isLowStock ? ' (Low)' : ''}` : 'Out of Stock'}
                                </span>
                            </button>
                        )
                    })}
                </div>
            )}

            {!outOfStock && !selectedVariant && (
                <p className="text-xs text-red-600 mt-3 font-medium">⚠️ Please select a size to add to cart</p>
            )}
        </div>
    )
}

'use client'
import { X, Package, Truck, CheckCircle, Clock } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const TrackingModal = ({ order, onClose }) => {
    const [mounted, setMounted] = useState(false)
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'

    useEffect(() => {
        setMounted(true)
    }, [])

    // Timeline statuses in order
    const timelineSteps = [
        { status: 'ORDER_PLACED', label: 'Order Placed', icon: Package, description: 'Your order has been confirmed' },
        { status: 'PROCESSING', label: 'Processing', icon: Clock, description: 'We\'re preparing your order' },
        { status: 'SHIPPED', label: 'Shipped', icon: Truck, description: 'Your order is on the way' },
        { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle, description: 'Order delivered successfully' }
    ]

    // Get current step index
    const currentStepIndex = timelineSteps.findIndex(step => step.status === order.status)

    // Check if status is completed
    const isCompleted = (stepStatus) => {
        const stepIndex = timelineSteps.findIndex(step => step.status === stepStatus)
        return stepIndex <= currentStepIndex
    }

    const modalContent = (
        <div onClick={onClose} className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
            <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                
                {/* Header */}
                <div className={`sticky top-0 bg-gradient-to-r ${order.isCancelled ? 'from-red-900 to-red-800' : 'from-slate-900 to-slate-800'} text-white p-6 flex justify-between items-center rounded-t-2xl`}>
                    <div>
                        <h2 className="text-2xl font-bold">Order Tracking</h2>
                        <p className="text-slate-300 text-sm mt-1">Order ID: {order.id.slice(0, 8)}...</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-300">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    
                    {/* Cancellation Notice */}
                    {order.isCancelled && (
                        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                            <p className="text-red-700 font-bold text-lg mb-3">✕ Order Cancelled</p>
                            <div className="space-y-2 text-sm text-red-600">
                                <p><span className="font-semibold">Cancelled by:</span> {order.cancelledBy === 'buyer' ? 'You' : 'Seller'}</p>
                                <p><span className="font-semibold">Date:</span> {new Date(order.cancelledAt).toLocaleString()}</p>
                                {order.cancellationReason && (
                                    <p><span className="font-semibold">Reason:</span> {order.cancellationReason.replace(/_/g, ' ')}</p>
                                )}
                                {order.cancellationDescription && (
                                    <p><span className="font-semibold">Details:</span> {order.cancellationDescription}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tracking Timeline */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-800">Delivery Status</h3>
                        
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-200 to-slate-100"></div>

                            {/* Timeline Steps */}
                            <div className="space-y-6 relative z-10">
                                {timelineSteps.map((step, index) => {
                                    const StepIcon = step.icon
                                    const completed = isCompleted(step.status)
                                    const isCurrent = step.status === order.status

                                    return (
                                        <div key={step.status} className="flex gap-4">
                                            {/* Icon Container */}
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                                                completed 
                                                    ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-500/50' 
                                                    : 'bg-slate-100 text-slate-400'
                                            }`}>
                                                <StepIcon size={24} className={isCurrent ? 'animate-pulse' : ''} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 pt-2">
                                                <div className={`font-bold text-base transition-colors ${
                                                    completed ? 'text-slate-800' : 'text-slate-400'
                                                }`}>
                                                    {step.label}
                                                </div>
                                                <p className={`text-sm mt-1 ${
                                                    completed ? 'text-slate-600' : 'text-slate-400'
                                                }`}>
                                                    {step.description}
                                                </p>
                                                {isCurrent && (
                                                    <div className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full animate-pulse">
                                                        Current Status
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Order Details Card */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Order Details</h3>
                        
                        <div className="space-y-4">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="flex gap-4 pb-4 border-b border-slate-200 last:border-0 last:pb-0">
                                    {/* Product Image */}
                                    <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-200">
                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            width={80}
                                            height={80}
                                            className="h-16 w-auto"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-800">{item.product.name}</p>
                                        <p className="text-sm text-slate-600 mt-1">Quantity: {item.quantity}</p>
                                        <p className="text-sm text-slate-600">Price: {currency}{item.price.toLocaleString()} × {item.quantity}</p>
                                        <p className="font-semibold text-slate-700 mt-2">{currency}{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Address Card */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Truck size={20} className="text-green-600" />
                            Delivery Address
                        </h3>
                        
                        <div className="space-y-2 text-slate-700">
                            <p className="font-semibold text-lg">{order.address.name}</p>
                            <p>{order.address.street}</p>
                            <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
                            <p>{order.address.country}</p>
                            <p className="font-semibold text-slate-800 mt-3">📱 {order.address.phone}</p>
                        </div>
                    </div>

                    {/* Price Summary Card */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Price Summary</h3>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between text-slate-700">
                                <span>Subtotal:</span>
                                <span className="font-semibold">{currency}{order.total.toLocaleString()}</span>
                            </div>
                            {order.isCouponUsed && (
                                <div className="flex justify-between text-slate-700">
                                    <span>Coupon Discount:</span>
                                    <span className="font-semibold text-green-600">-{currency}{(order.coupon?.discount || 0).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="border-t border-indigo-200 pt-3">
                                <div className="flex justify-between">
                                    <span className="font-bold text-slate-800">Total Amount:</span>
                                    <span className="font-bold text-indigo-700 text-lg">{currency}{order.total.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="mt-2 flex justify-between text-sm">
                                <span className={`px-3 py-1 rounded-full font-semibold ${
                                    order.isPaid 
                                        ? 'bg-green-200 text-green-700' 
                                        : 'bg-yellow-200 text-yellow-700'
                                }`}>
                                    {order.isPaid ? '✓ Paid' : 'Payment Pending'}
                                </span>
                                <span className="px-3 py-1 rounded-full font-semibold bg-slate-200 text-slate-700">
                                    {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Stripe Payment'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Info Footer */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm text-slate-600 space-y-1">
                        <p><span className="font-semibold">Order Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                        <p><span className="font-semibold">Last Updated:</span> {new Date(order.updatedAt).toLocaleString()}</p>
                    </div>

                </div>

                {/* Close Button */}
                <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gradient-to-r from-slate-700 to-slate-900 text-white font-semibold rounded-lg hover:shadow-lg btn-animate transition-all duration-300"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    )

    if (!mounted) return null

    return createPortal(modalContent, document.body)
}

export default TrackingModal

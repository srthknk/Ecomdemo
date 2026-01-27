'use client'
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import { orderDummyData } from "@/assets/assets"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import toast from "react-hot-toast"
import SellerCancelOrderModal from "@/components/SellerCancelOrderModal"

export default function StoreOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [cancelModalOpen, setCancelModalOpen] = useState(false)


    const { getToken } = useAuth()

    const fetchOrders = async () => {
       try {
        const token = await getToken()
        const { data } = await axios.get('/api/store/orders', {headers: { Authorization: `Bearer ${token}` }})
        setOrders(data.orders)
       } catch (error) {
        toast.error(error?.response?.data?.error || error.message)
       }finally{
        setLoading(false)
       }
    }

    const updateOrderStatus = async (orderId, status) => {
        try {
            const token = await getToken()
            await axios.post('/api/store/orders',{orderId, status}, {headers: { Authorization: `Bearer ${token}` }})
            setOrders(prev =>
                prev.map(order => 
                    order.id === orderId ? {...order, status} : order
                )
            )
            toast.success('Order status updated!')
       } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
       }
    }

    const openModal = (order) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSelectedOrder(null)
        setIsModalOpen(false)
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    if (loading) return <Loading />

    return (
        <>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-800 mb-6">Store <span className="text-slate-800 font-medium">Orders</span></h1>
            
            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-slate-500 text-lg">No orders found</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden sm:block overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Sr. No.</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Customer</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700 hidden md:table-cell">Total</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700 hidden lg:table-cell">Payment</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700 hidden lg:table-cell">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-slate-700">
                                {orders.map((order, index) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                                        onClick={() => openModal(order)}
                                    >
                                        <td className="px-4 py-3 text-green-600 font-medium">{index + 1}</td>
                                        <td className="px-4 py-3 font-medium">{order.user?.name}</td>
                                        <td className="px-4 py-3 font-semibold text-slate-800 hidden md:table-cell">₹{order.total?.toLocaleString()}</td>
                                        <td className="px-4 py-3 hidden lg:table-cell text-slate-600">{order.paymentMethod}</td>
                                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                            {order.isCancelled ? (
                                                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700">
                                                    CANCELLED
                                                </span>
                                            ) : (
                                                <select
                                                    value={order.status}
                                                    onChange={e => updateOrderStatus(order.id, e.target.value)}
                                                    className={`px-3 py-1 rounded-lg text-xs font-medium border-0 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all ${
                                                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                                        order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    <option value="ORDER_PLACED">ORDER PLACED</option>
                                                    <option value="PROCESSING">PROCESSING</option>
                                                    <option value="SHIPPED">SHIPPED</option>
                                                    <option value="DELIVERED">DELIVERED</option>
                                                </select>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell text-slate-600 text-xs">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="sm:hidden space-y-3">
                        {orders.map((order, index) => (
                            <div
                                key={order.id}
                                onClick={() => openModal(order)}
                                className="border border-slate-200 rounded-lg p-4 bg-gradient-to-br from-white to-slate-50 hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Order #{index + 1}</p>
                                        <p className="font-semibold text-slate-800">{order.user?.name}</p>
                                    </div>
                                    <span className="text-lg font-bold text-green-600">₹{order.total?.toLocaleString()}</span>
                                </div>

                                <div className="space-y-2 mb-3">
                                    <p className="text-sm text-slate-600">
                                        <span className="font-medium text-slate-700">Payment:</span> {order.paymentMethod}
                                    </p>
                                    {order.isCouponUsed && (
                                        <p className="text-sm text-slate-600">
                                            <span className="font-medium text-slate-700">Coupon:</span> {order.coupon?.code}
                                        </p>
                                    )}
                                    <p className="text-xs text-slate-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div onClick={(e) => e.stopPropagation()}>
                                    {order.isCancelled ? (
                                        <div className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 text-center">
                                            CANCELLED
                                        </div>
                                    ) : (
                                        <select
                                            value={order.status}
                                            onChange={e => updateOrderStatus(order.id, e.target.value)}
                                            className={`w-full px-3 py-2 rounded-lg text-sm font-medium border-0 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all ${
                                                order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                                order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-slate-100 text-slate-700'
                                            }`}
                                        >
                                            <option value="ORDER_PLACED">ORDER PLACED</option>
                                            <option value="PROCESSING">PROCESSING</option>
                                            <option value="SHIPPED">SHIPPED</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Modal */}
            {isModalOpen && selectedOrder && (
                <div onClick={closeModal} className="fixed inset-0 flex items-center justify-center bg-black/50 text-slate-700 backdrop-blur-sm z-50 p-4">
                    <div onClick={e => e.stopPropagation()} className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto p-4 sm:p-6 relative">
                        <h2 className="text-lg sm:text-2xl font-semibold text-slate-900 mb-4 text-center">
                            Order Details
                        </h2>

                        {/* Customer Details */}
                        <div className="mb-6 pb-4 border-b border-slate-200">
                            <h3 className="font-semibold text-slate-800 mb-3">Customer Details</h3>
                            <div className="space-y-1 text-sm">
                                <p><span className="text-green-700 font-medium">Name:</span> {selectedOrder.user?.name}</p>
                                <p><span className="text-green-700 font-medium">Email:</span> {selectedOrder.user?.email}</p>
                                <p><span className="text-green-700 font-medium">Phone:</span> {selectedOrder.address?.phone}</p>
                                <p className="break-words"><span className="text-green-700 font-medium">Address:</span> {`${selectedOrder.address?.street}, ${selectedOrder.address?.city}, ${selectedOrder.address?.state}, ${selectedOrder.address?.zip}, ${selectedOrder.address?.country}`}</p>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="mb-6 pb-4 border-b border-slate-200">
                            <h3 className="font-semibold text-slate-800 mb-3">Products</h3>
                            <div className="space-y-3">
                                {selectedOrder.orderItems.map((item, i) => (
                                    <div key={i} className="flex gap-3 border border-slate-100 rounded-lg p-3 bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <img
                                            src={item.product?.images?.[0]}
                                            alt={item.product?.name}
                                            className="w-16 h-16 object-cover rounded flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-800 truncate text-sm">{item.product?.name}</p>
                                            {item.selectedSize && (
                                                <p className="text-xs text-blue-600 font-medium">Size: {item.selectedSize}</p>
                                            )}
                                            <p className="text-xs text-slate-600 mt-1">Qty: <span className="font-semibold">{item.quantity}</span></p>
                                            <p className="text-sm font-semibold text-slate-800">₹{item.price?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment & Status */}
                        <div className="mb-6 space-y-2 text-sm pb-4 border-b border-slate-200">
                            <p><span className="text-green-700 font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                            <p><span className="text-green-700 font-medium">Paid:</span> <span className={selectedOrder.isPaid ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{selectedOrder.isPaid ? "Yes" : "No"}</span></p>
                            {selectedOrder.isCouponUsed && (
                                <p><span className="text-green-700 font-medium">Coupon:</span> {selectedOrder.coupon?.code} ({selectedOrder.coupon?.discount}% off)</p>
                            )}
                            <p><span className="text-green-700 font-medium">Order Status:</span> {selectedOrder.status}</p>
                            <p><span className="text-green-700 font-medium">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            
                        {/* Cancellation Info */}
                        {selectedOrder.isCancelled && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                                <p className="text-red-700 font-bold mb-1">❌ Order Cancelled</p>
                                <p className="text-red-600 text-xs"><span className="font-semibold">By:</span> {selectedOrder.cancelledBy === 'buyer' ? 'Customer' : 'You (Seller)'}</p>
                                {selectedOrder.cancellationReason && (
                                    <p className="text-red-600 text-xs mt-1"><span className="font-semibold">Reason:</span> {selectedOrder.cancellationReason.replace(/_/g, ' ')}</p>
                                )}
                                {selectedOrder.cancellationDescription && (
                                    <p className="text-red-600 text-xs mt-1"><span className="font-semibold">Message:</span> {selectedOrder.cancellationDescription}</p>
                                )}
                            </div>
                        )}

                        {/* Status Update - Only if not cancelled */}
                        {!selectedOrder.isCancelled && (
                            <div className="mb-6 pb-4 border-b border-slate-200">
                                <h3 className="font-semibold text-slate-800 mb-3">Update Order Status</h3>
                                <select
                                    value={selectedOrder.status}
                                    onChange={e => {
                                        updateOrderStatus(selectedOrder.id, e.target.value)
                                        setSelectedOrder({...selectedOrder, status: e.target.value})
                                    }}
                                    className={`w-full px-4 py-2 rounded-lg font-medium border-2 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all ${
                                        selectedOrder.status === 'DELIVERED' ? 'border-green-300 bg-green-50 text-green-700' :
                                        selectedOrder.status === 'SHIPPED' ? 'border-blue-300 bg-blue-50 text-blue-700' :
                                        selectedOrder.status === 'PROCESSING' ? 'border-yellow-300 bg-yellow-50 text-yellow-700' :
                                        'border-slate-300 bg-slate-50 text-slate-700'
                                    }`}
                                >
                                    <option value="ORDER_PLACED">ORDER PLACED</option>
                                    <option value="PROCESSING">PROCESSING</option>
                                    <option value="SHIPPED">SHIPPED</option>
                                    <option value="DELIVERED">DELIVERED</option>
                                </select>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-2">
                            {!selectedOrder.isCancelled && !['DELIVERED', 'SHIPPED'].includes(selectedOrder.status) && (
                                <button 
                                    onClick={() => { setCancelModalOpen(true); closeModal(); }}
                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 btn-animate font-medium transition-all duration-300"
                                >
                                    Cancel Order
                                </button>
                            )}
                            <button onClick={closeModal} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 btn-animate btn-secondary font-medium transition-all duration-300">
                                Close
                            </button>
                        </div>
                            <button onClick={closeModal} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 btn-animate btn-secondary font-medium transition-all duration-300">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {cancelModalOpen && selectedOrder && (
                <SellerCancelOrderModal 
                    order={selectedOrder} 
                    onClose={() => setCancelModalOpen(false)}
                    onCancelSuccess={() => {
                        setOrders(prev =>
                            prev.map(order =>
                                order.id === selectedOrder.id ? {...order, isCancelled: true, status: 'CANCELLED'} : order
                            )
                        )
                        setSelectedOrder(null)
                        setIsModalOpen(false)
                    }}
                />
            )}
        </>
    )
}

import Razorpay from 'razorpay'

// Initialize Razorpay instance
// Keys will be added from environment variables
const razorpayInstance = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || ''
})

export default razorpayInstance

// Helper function to create Razorpay order
export async function createRazorpayOrder(amount, notes = {}) {
    try {
        const order = await razorpayInstance.orders.create({
            amount: Math.round(amount * 100), // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: notes
        })
        return order
    } catch (error) {
        console.error('Error creating Razorpay order:', error)
        throw error
    }
}

// Helper function to verify payment signature
export function verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    try {
        const crypto = require('crypto')
        const body = `${razorpayOrderId}|${razorpayPaymentId}`
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex')
        
        return expectedSignature === razorpaySignature
    } catch (error) {
        console.error('Error verifying payment signature:', error)
        return false
    }
}

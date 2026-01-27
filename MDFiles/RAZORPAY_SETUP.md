# 🚀 Razorpay Payment Integration Setup Guide

## Overview
Complete payment integration with Razorpay supporting UPI, Cards, and Wallets with test mode ready.

---

## 📋 Features Implemented

✅ **Payment Methods**
- UPI Payments (Indian users)
- Credit/Debit Cards (Visa, Mastercard, RuPay)
- Digital Wallets (PayPal, Amazon Pay, Google Pay)
- COD (Cash on Delivery - optional)

✅ **Payment Flow**
1. User adds items to cart
2. Checkout page with address selection
3. Payment method selection
4. Razorpay modal opens for payment
5. Payment verification
6. Order success/failure pages
7. Seller dashboard shows payment status

✅ **Database Tracking**
- Order with payment ID, status, and signature
- Payment status: PENDING → SUCCESS/FAILED → REFUNDED
- Payment method tracking
- Razorpay order ID and payment ID storage

✅ **Security**
- Signature verification (prevents tampering)
- Webhook handler for server-side verification
- Secure payment storage
- Environment variable separation

---

## 🔧 Setup Instructions

### Step 1: Sign Up for Razorpay
1. Go to [https://razorpay.com](https://razorpay.com)
2. Sign up with your email (no credit card required)
3. Verify your email
4. You'll be in **Test Mode** by default

### Step 2: Get API Keys
1. Go to Dashboard → Settings → API Keys
2. Copy your:
   - **Key ID** (public key)
   - **Key Secret** (private key)
3. Also get **Webhook Secret** from Webhooks section

### Step 3: Add Environment Variables
Edit `.env.local` and add:

```env
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

### Step 4: Run Database Migration
```bash
npx prisma migrate dev --name add_payment_integration
```

This will:
- Add `paymentStatus` enum (PENDING, SUCCESS, FAILED, REFUNDED)
- Add `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature` to Order
- Update `PaymentMethod` enum with Razorpay options

### Step 5: Install Dependencies
```bash
npm install razorpay
```

---

## 🧪 Testing with Dummy Credentials

### Test Card Numbers (In Test Mode)

| Card Type | Number | CVV | Date |
|-----------|--------|-----|------|
| **Visa** | 4111 1111 1111 1111 | 123 | Any future date |
| **Mastercard** | 5555 5555 5555 4444 | 123 | Any future date |
| **RuPay** | 6522 1234 5678 9012 | 123 | Any future date |

### Test UPI IDs
- `success@razorpay` (auto-approved in test)
- `failure@razorpay` (auto-declined in test)

### Test Wallets
- Google Pay / Apple Pay / PayPal - Use test cards above

---

## 📁 Files Created/Modified

### New Files
```
configs/razorpay.js                          # Razorpay config & helpers
app/api/payments/route.js                    # Payment creation & verification
app/api/payments/webhook/route.js            # Razorpay webhook handler
app/api/orders/[orderId]/route.js            # Fetch order details
components/CheckoutComponent.jsx             # Checkout UI with Razorpay
app/(public)/order-success/[orderId]/page.jsx  # Success page
app/(public)/order-failed/[orderId]/page.jsx   # Failure page
.env.razorpay.template                       # Environment variables template
```

### Modified Files
```
prisma/schema.prisma                         # Added payment fields to Order
app/layout.jsx                               # Added Razorpay script
```

---

## 🔄 Payment Flow Diagram

```
User Cart → Checkout Page → Select Address
                ↓
         Select Payment Method
                ↓
      Backend creates Order (PENDING)
                ↓
    Razorpay Modal Opens → User Enters Payment Details
                ↓
         Payment Success ← → Payment Failed
                ↓                      ↓
    Verify Signature         Show Error Page
                ↓
    Update Order (SUCCESS)
                ↓
    Order Success Page ← Clear Cart
                ↓
    Seller sees order with payment details
```

---

## 🎯 Key Components

### CheckoutComponent.jsx
- Address selection
- Payment method choice
- Cart summary
- Razorpay modal integration
- Error handling

### Order Success Page
- Order confirmation details
- Delivery address display
- Order items list
- Payment method shown
- Links to track orders

### Order Failed Page
- Clear error message
- Common failure reasons
- Steps to resolve
- Retry option

### Seller Dashboard
- Shows payment status (✅ Paid or ❌ Pending)
- Payment method displayed
- Razorpay transaction ID visible

---

## 🔐 Security Best Practices

1. **Never expose Key Secret** - Keep in .env only
2. **Always verify signatures** - Prevents payment tampering
3. **Webhook verification** - Server-side confirmation
4. **HTTPS in production** - Required by Razorpay
5. **Store order details** - For audit trail

---

## 🌍 Going Live

### Before Production:
1. Complete KYC verification with Razorpay
2. Activate production account
3. Get production API keys
4. Test with real payments
5. Set up webhook URL in Razorpay dashboard

### Production Setup:
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=prod_key_here
RAZORPAY_KEY_SECRET=prod_secret_here
RAZORPAY_WEBHOOK_SECRET=prod_webhook_secret
```

---

## 📞 API Endpoints

### POST /api/payments
Create payment order
```json
{
  "total": 500,
  "cartItems": [...],
  "addressId": "addr_123",
  "storeId": "store_123",
  "coupon": null
}
```

### PUT /api/payments
Verify payment after successful transaction
```json
{
  "razorpayOrderId": "order_id",
  "razorpayPaymentId": "payment_id",
  "razorpaySignature": "signature",
  "paymentMethod": "RAZORPAY_UPI"
}
```

### POST /api/payments/webhook
Razorpay webhook callback (automatic)

### GET /api/orders/[orderId]
Fetch order details with payment status

---

## ✅ Testing Checklist

- [ ] Razorpay account created
- [ ] API keys added to .env.local
- [ ] Database migrated
- [ ] Checkout page loads
- [ ] Payment modal opens
- [ ] Test card payment succeeds
- [ ] Order success page displays
- [ ] Seller dashboard shows payment status
- [ ] Failed payment shown correctly
- [ ] Order details API works

---

## 🐛 Troubleshooting

### Razorpay script not loading
```
Check: NEXT_PUBLIC_RAZORPAY_KEY_ID is set
Fix: Clear browser cache, hard refresh (Ctrl+Shift+R)
```

### Payment verification fails
```
Check: RAZORPAY_KEY_SECRET is correct
Fix: Verify signature verification logic in configs/razorpay.js
```

### Order not saving
```
Check: Database connection working
Fix: Run: npx prisma migrate dev
```

### Webhook not working
```
Check: URL is publicly accessible
Fix: Ngrok tunnel needed for local testing
```

---

## 📚 Useful Links

- [Razorpay Documentation](https://razorpay.com/docs)
- [Test Card Numbers](https://razorpay.com/docs/payments/payments-gateway/test-mode/)
- [Webhook Events](https://razorpay.com/docs/webhooks/)
- [API Keys Management](https://dashboard.razorpay.com/app/keys)

---

## 💡 Next Steps

1. ✅ Setup infrastructure (DONE)
2. ⏳ Add to checkout flow
3. ⏳ Test with dummy cards
4. ⏳ Webhook testing (requires ngrok for local)
5. ⏳ Admin dashboard payment display
6. ⏳ Go live with production keys

---

**Questions?** Check the troubleshooting section or Razorpay docs.

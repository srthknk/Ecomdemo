# 🚀 Quick Start Guide - Clothing Stock & Size System

## For Sellers: Adding Your First Clothing Product

### Step 1: Navigate to Add Product
```
Store → Add Product
```

### Step 2: Fill Basic Details
- Product Name: "Blue Cotton T-Shirt"
- Description: "Comfortable everyday t-shirt"
- MRP: ₹999
- Offer Price: ₹599
- Category: "T-Shirts"
- Upload 1-4 product images

### Step 3: Enable Clothing Mode
- ✅ Check "This is a Clothing Product"
- Size input fields will appear automatically

### Step 4: Add Sizes and Stock
Click "Add Size" button and for each size:

| Size | Units |
|------|-------|
| XS   | 5     |
| S    | 10    |
| M    | 15    |
| L    | 12    |
| XL   | 8     |
| XXL  | 3     |

### Step 5: Submit
- Click "Add Product" button
- Product is now live with size variants!

---

## For Buyers: Purchasing Clothing Items

### Step 1: Browse Products
- Clothing products show "Available in multiple sizes"
- Out of stock items show grey overlay with icon

### Step 2: View Product Details
- Click product to open detail page
- See "Size Guide" button (Info icon)
- Review size measurements if needed

### Step 3: Select Size
- Interactive size buttons appear
- Green = Selected
- Red = Out of stock (disabled)
- Orange tag = Low stock (⚠️ Limited units)
- Shows exact units available

### Step 4: Add to Cart
- Can only add to cart after size selected
- Blue badge shows chosen size in cart

### Step 5: View in Orders
- Go to "My Orders"
- Selected size shown in blue badge
- Easy reference for future purchases

---

## For Sellers: Managing Inventory

### Check Stock Status
1. Go to **Store Dashboard**
2. Scroll to **Inventory Overview** section
3. See:
   - Total units in stock
   - Out of stock count
   - Low stock count (≤10 units)
   - Inventory health score (%)

### Low Stock Alerts
- Red box = Out of stock (0 units)
- Orange box = Low stock (≤10 units)
- Shows specific sizes if clothing product

### Size Popularity
- Go to **Size Analytics** section
- See which sizes sell the most
- Bar chart shows percentage distribution
- Helps plan future orders

### Edit Product Stock
1. Go to **Store → Manage Products**
2. Click product to edit
3. Update size units
4. Save changes
5. Stock updates in real-time

---

## Stock Rules & Logic

### Automatic Stock Deduction
```
When order placed:
- Stock is reserved
- Size-specific units decreased
- Regular product units decreased

When order cancelled:
- Stock is returned to inventory
- Size variant units restored
- Regular product units restored
```

### Stock Display Rules
```
Product Card:
- Out of stock = Grey overlay + icon
- Low stock = Orange badge "Low Stock"

Size Selector:
- XS (5 units) = Green button
- M (2 units) = Orange "Low" badge
- L (0 units) = Disabled red button
```

### Status Updates
```
Inventory Health Score:
- 80-100% = Green (Healthy)
- 50-79% = Yellow (Warning)
- Below 50% = Red (Critical)
```

---

## Using Size Guide

### As a Buyer
1. Click "Size Guide" button (Info icon)
2. Modal opens with all sizes
3. Each size shows:
   - Chest measurement
   - Waist measurement
   - Length measurement
4. Example: Size M = 38-40" chest, 32-34" waist

### Pro Tips
- Measure your current well-fitting garment
- Compare with size guide measurements
- Check reviews for fit feedback
- Consider material shrinkage

---

## Return/Exchange for Sizing Issues

### How to Request Exchange
1. Go to **My Orders**
2. Find the order with sizing issue
3. Click "Return/Exchange" button
4. Fill form:
   - Select "Exchange"
   - Choose reason: "Wrong Size"
   - Write description
   - Select replacement size
5. Submit request

### What Happens Next
- Seller reviews your request
- Approves exchange
- You receive return label
- Send back old item
- Receive new size

---

## Seller Dashboard Widgets

### Inventory Overview Card
Shows 4 quick metrics:
1. **Total Units** - Sum of all stock
2. **Out of Stock** - Products at 0 units
3. **Low Stock** - Products ≤10 units
4. **Health Score** - % of products in stock

### Size Popularity Widget
Shows:
- Chart of all size sales
- Most popular size highlighted
- Percentage breakdown per size
- Helps predict future demand

---

## Common Scenarios

### Scenario 1: Clothing Item Out of Stock
```
✓ Check: Inventory Overview → Out of Stock count
✓ View: Size Analytics to see which size sold out first
✓ Action: Restock popular sizes first
✓ Result: Update units, inStock status auto-updates
```

### Scenario 2: Size M Gets Low Stock
```
✓ Alert: Inventory Alert Card shows "M: 2 units left"
✓ Recommendation: "Consider restocking 1 item(s)"
✓ Action: Edit product, increase M units
✓ Result: Stock updated immediately, alert clears
```

### Scenario 3: Order With Wrong Size
```
✓ Buyer: Clicks "Return/Exchange" on order
✓ Form: Selects "Exchange" → "Wrong Size"
✓ Size: Chooses new size from dropdown
✓ Seller: Reviews and approves exchange
✓ Result: Order updated with new size
```

---

## API Integration (For Developers)

### Create Clothing Product
```javascript
const formData = new FormData()
formData.append('name', 'T-Shirt')
formData.append('price', 599)
formData.append('isClothing', true)
formData.append('sizesData', JSON.stringify([
  { size: 'M', units: 10 },
  { size: 'L', units: 15 }
]))

await axios.post('/api/store/product', formData)
```

### Update Stock After Order
```javascript
await axios.post('/api/products/update-stock', {
  orderId: 'order_123'
})
```

### Fetch Products With Sizes
```javascript
const { data } = await axios.get('/api/products')
// Returns: products with productSizes array
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't add sizes | Check "This is a Clothing Product" first |
| Size won't select | Product might be out of stock |
| Stock didn't update | Ensure order is confirmed |
| Size guide not showing | Click Info button next to size selector |
| Low stock alert wrong | Clear browser cache and reload |
| Size not in order | Size only shown for clothing items |

---

## Key Features Summary

✅ **For Sellers:**
- Add multiple sizes per clothing product
- Track units per size
- View low stock alerts
- See size popularity
- Get restocking recommendations
- Manage inventory health

✅ **For Buyers:**
- See size guide with measurements
- Select from available sizes
- Out of stock sizes disabled
- Low stock warnings
- Size shown in order history
- Request exchanges by size

✅ **Automatic Features:**
- Stock decreases after order
- Stock restores on cancellation
- Out of stock products hidden
- Size popularity tracking
- Health score calculations

---

## Next Steps

1. **Sellers**: Upload clothing products with sizes
2. **Test**: Place orders and verify stock updates
3. **Monitor**: Check inventory dashboard daily
4. **Optimize**: Use size analytics to plan orders
5. **Scale**: Add more products as system runs smoothly

---

## Support

For issues or questions:
1. Check documentation in `/CLOTHING_SYSTEM_GUIDE.md`
2. Review component code in `/components/`
3. Check API endpoints in `/app/api/`
4. Debug using browser console logs

---

**You're all set! Start using the clothing stock and size system today!** 🎉

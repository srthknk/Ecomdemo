import prisma from "@/lib/prisma"
import authSeller from "@/middlewares/authSeller"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if (!storeId) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 })
        }

        const { productId, isClothing, stockData } = await request.json()

        if (!productId || !stockData) {
            return NextResponse.json({ error: 'missing required fields' }, { status: 400 })
        }

        // Check if product belongs to this seller
        const product = await prisma.product.findUnique({ 
            where: { id: productId },
            include: { productSizes: true }
        })

        if (!product || product.storeId !== storeId) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 })
        }

        let updatedProduct

        if (isClothing && product.isClothing) {
            // Update sizes for clothing product
            let totalUnits = 0
            
            // Update each size's stock
            for (const [size, units] of Object.entries(stockData)) {
                const numUnits = Number(units)
                totalUnits += numUnits

                await prisma.productSize.update({
                    where: {
                        productId_size: {
                            productId,
                            size
                        }
                    },
                    data: {
                        availableUnits: numUnits,
                        totalUnits: numUnits
                    }
                })
            }

            // Check if any size has stock
            const hasStock = totalUnits > 0

            updatedProduct = await prisma.product.update({
                where: { id: productId },
                data: {
                    totalUnits,
                    inStock: hasStock
                },
                include: { productSizes: true }
            })
        } else {
            // Update regular product stock
            const units = Number(stockData.units)
            updatedProduct = await prisma.product.update({
                where: { id: productId },
                data: {
                    totalUnits: units,
                    inStock: units > 0
                },
                include: { productSizes: true }
            })
        }

        return NextResponse.json({
            message: 'Stock updated successfully',
            updatedProduct
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.message || 'Failed to update stock' }, { status: 400 })
    }
}

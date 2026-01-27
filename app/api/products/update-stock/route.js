import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

// Update product stock after order placement
export async function POST(request) {
    try {
        const { userId } = getAuth(request)

        if (!userId) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 })
        }

        const { orderId } = await request.json()

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
        }

        // Get order with items
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        })

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        if (order.userId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Update stock for each item
        for (const item of order.orderItems) {
            const product = item.product

            if (product.isClothing && item.selectedSize) {
                // Update size-specific stock
                const productSize = await prisma.productSize.findUnique({
                    where: {
                        productId_size: {
                            productId: product.id,
                            size: item.selectedSize
                        }
                    }
                })

                if (productSize && productSize.availableUnits >= item.quantity) {
                    await prisma.productSize.update({
                        where: { id: productSize.id },
                        data: {
                            availableUnits: {
                                decrement: item.quantity
                            }
                        }
                    })
                }
            } else if (!product.isClothing) {
                // Update regular product stock
                if (product.totalUnits >= item.quantity) {
                    await prisma.product.update({
                        where: { id: product.id },
                        data: {
                            totalUnits: {
                                decrement: item.quantity
                            }
                        }
                    })
                }
            }
        }

        // Update product inStock status
        for (const item of order.orderItems) {
            const product = item.product

            if (product.isClothing) {
                const totalAvailable = await prisma.productSize.aggregate({
                    where: { productId: product.id },
                    _sum: { availableUnits: true }
                })
                
                await prisma.product.update({
                    where: { id: product.id },
                    data: { inStock: (totalAvailable._sum.availableUnits || 0) > 0 }
                })
            } else {
                await prisma.product.update({
                    where: { id: product.id },
                    data: { inStock: product.totalUnits > 0 }
                })
            }
        }

        return NextResponse.json({ message: 'Stock updated successfully' })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}

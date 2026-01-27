import imagekit from "@/configs/imageKit"
import prisma from "@/lib/prisma"
import authSeller from "@/middlewares/authSeller"
import {getAuth} from "@clerk/nextjs/server"
import { NextResponse } from "next/server";

// Add a new product
export async function POST(request){
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({error: 'not authorized'}, { status: 401 } )
        }
        // Get the data from the form
        const formData = await request.formData()
        const name = formData.get("name")
        const description = formData.get("description")
        const mrp =  Number(formData.get("mrp"))
        const price = Number(formData.get("price"))
        const category = formData.get("category")
        const images = formData.getAll("images")
        const isClothing = formData.get("isClothing") === "true"
        const sizesData = formData.get("sizesData") ? JSON.parse(formData.get("sizesData")) : []

        if(!name || !description || !mrp || !price || !category || images.length < 1){
            return NextResponse.json({error: 'missing product details'}, { status: 400 } )
        }

        if(isClothing && sizesData.length === 0){
            return NextResponse.json({error: 'clothing products must have at least one size'}, { status: 400 } )
        }

        // Uploading Images to ImageKit
        const imagesUrl = await Promise.all(images.map(async (image) => {
            const buffer = Buffer.from(await image.arrayBuffer());
            const response = await imagekit.upload({
                file: buffer,
                fileName: image.name,
                folder: "products",
            })
            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1024' }
                ]
            })
            return url
        }))

        // Calculate total units for non-clothing products
        let totalUnits = 0
        if(!isClothing){
            totalUnits = formData.get("units") ? Number(formData.get("units")) : 0
        } else {
            totalUnits = sizesData.reduce((sum, size) => sum + size.units, 0)
        }

        const product = await prisma.product.create({
             data: {
                name,
                description,
                mrp,
                price,
                category,
                images: imagesUrl,
                storeId,
                isClothing,
                totalUnits,
                inStock: totalUnits > 0
             }
        })

        // Create size variants if clothing product
        if(isClothing && sizesData.length > 0){
            await prisma.productSize.createMany({
                data: sizesData.map(size => ({
                    productId: product.id,
                    size: size.size,
                    totalUnits: size.units,
                    availableUnits: size.units
                }))
            })
        }

         return NextResponse.json({message: "Product added successfully", productId: product.id})

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}

// Get all products for a seller
export async function GET(request){
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({error: 'not authorized'}, { status: 401 } )
        }
        const products = await prisma.product.findMany({ 
            where: { storeId },
            include: {
                productSizes: true
            }
        })

        return NextResponse.json({products})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}

// Update a product
export async function PUT(request){
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({error: 'not authorized'}, { status: 401 } )
        }

        const formData = await request.formData()
        const productId = formData.get("productId")
        const name = formData.get("name")
        const description = formData.get("description")
        const mrp = Number(formData.get("mrp"))
        const price = Number(formData.get("price"))
        const category = formData.get("category")
        const newImages = formData.getAll("newImages")

        if(!productId || !name || !description || !mrp || !price || !category){
            return NextResponse.json({error: 'missing product details'}, { status: 400 } )
        }

        // Check if product belongs to this seller
        const product = await prisma.product.findUnique({ where: { id: productId } })
        if(!product || product.storeId !== storeId){
            return NextResponse.json({error: 'not authorized'}, { status: 401 } )
        }

        // Upload new images if provided
        let imagesUrl = product.images
        if(newImages.length > 0){
            imagesUrl = await Promise.all(newImages.map(async (image) => {
                const buffer = Buffer.from(await image.arrayBuffer());
                const response = await imagekit.upload({
                    file: buffer,
                    fileName: image.name,
                    folder: "products",
                })
                const url = imagekit.url({
                    path: response.filePath,
                    transformation: [
                        { quality: 'auto' },
                        { format: 'webp' },
                        { width: '1024' }
                    ]
                })
                return url
            }))
        }

        await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                description,
                mrp,
                price,
                category,
                images: imagesUrl
            }
        })

        return NextResponse.json({message: "Product updated successfully"})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}

// Delete a product
export async function DELETE(request){
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({error: 'not authorized'}, { status: 401 } )
        }

        const { searchParams } = new URL(request.url)
        const productId = searchParams.get("productId")

        if(!productId){
            return NextResponse.json({error: 'product id required'}, { status: 400 } )
        }

        // Check if product belongs to this seller
        const product = await prisma.product.findUnique({ where: { id: productId } })
        if(!product || product.storeId !== storeId){
            return NextResponse.json({error: 'not authorized'}, { status: 401 } )
        }

        // Delete related ratings first (they have onDelete: Cascade but let's be explicit)
        await prisma.rating.deleteMany({
            where: { productId }
        })

        // Delete related order items
        await prisma.orderItem.deleteMany({
            where: { productId }
        })

        // Now delete the product
        await prisma.product.delete({ where: { id: productId } })

        return NextResponse.json({message: "Product deleted successfully"})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}
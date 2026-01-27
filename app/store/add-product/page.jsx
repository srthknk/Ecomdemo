'use client'
import { assets } from "@/assets/assets"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { Plus, Trash2 } from "lucide-react"

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

export default function StoreAddProduct() {

    const categories = ['T-Shirts', 'Shirts', 'Trousers', 'Jeans', 'Kurta', 'Kurti', 'Saree', 'Dress', 'Jacket', 'Sweater', 'Others']

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
        isClothing: false,
        units: 0,
    })
    const [clothingSizes, setClothingSizes] = useState([])
    const [loading, setLoading] = useState(false)
    const [aiUsed, setAiUsed] = useState(false)

    const { getToken } = useAuth()

    const onChangeHandler = (e) => {
        const { name, value, type, checked } = e.target
        setProductInfo({ 
            ...productInfo, 
            [name]: type === 'checkbox' ? checked : value 
        })
    }

    const addClothingSize = () => {
        setClothingSizes([...clothingSizes, { size: '', units: 0 }])
    }

    const updateClothingSize = (index, field, value) => {
        const updatedSizes = [...clothingSizes]
        updatedSizes[index] = { ...updatedSizes[index], [field]: field === 'units' ? Number(value) : value }
        setClothingSizes(updatedSizes)
    }

    const removeClothingSize = (index) => {
        setClothingSizes(clothingSizes.filter((_, i) => i !== index))
    }

    const handleImageUpload = async (key, file) => {
        setImages(prev => ({ ...prev, [key]: file }))

        if (key === "1" && file && !aiUsed) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = async () => {
                const base64String = reader.result.split(",")[1]
                const mimeType = file.type
                const token = await getToken()

                try {
                    await toast.promise(
                        axios.post(
                            "/api/store/ai",
                            { base64Image: base64String, mimeType },
                            { headers: { Authorization: `Bearer ${token}` } }
                        ),
                        {
                            loading: "Analyzing image with AI...",
                            success: (res) => {
                                console.log(res);
                                
                                const data = res.data
                                if (data.warning) {
                                    // Quota exceeded or service unavailable
                                    return data.error || "AI service temporarily unavailable. Fill details manually."
                                }
                                if (data.name && data.description) {
                                    setProductInfo(prev => ({
                                        ...prev,
                                        name: data.name,
                                        description: data.description
                                    }))
                                    setAiUsed(true)
                                    return "AI filled product info 🎉"
                                }
                                return "AI could not analyze the image"
                            },
                            error: (err) =>
                                err?.response?.data?.error || err.message
                        }
                    )
                } catch (error) {
                    console.error(error)
                }
            }
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            if (!images[1] && !images[2] && !images[3] && !images[4]) {
                return toast.error('Please upload at least one image')
            }

            if(productInfo.isClothing && clothingSizes.length === 0){
                return toast.error('Please add at least one clothing size')
            }

            if(productInfo.isClothing && clothingSizes.some(s => !s.size || s.units <= 0)){
                return toast.error('All clothing sizes must have a size and units greater than 0')
            }

            setLoading(true)

            const formData = new FormData()
            formData.append('name', productInfo.name)
            formData.append('description', productInfo.description)
            formData.append('mrp', productInfo.mrp)
            formData.append('price', productInfo.price)
            formData.append('category', productInfo.category)
            formData.append('isClothing', productInfo.isClothing)
            
            if(productInfo.isClothing){
                formData.append('sizesData', JSON.stringify(clothingSizes))
            } else {
                formData.append('units', productInfo.units)
            }

            Object.keys(images).forEach((key) => {
                images[key] && formData.append('images', images[key])
            })

            const token = await getToken()
            const { data } = await axios.post('/api/store/product', formData, { headers: { Authorization: `Bearer ${token}` } })
            toast.success(data.message)

            setProductInfo({ name: "", description: "", mrp: 0, price: 0, category: "", isClothing: false, units: 0 })
            setImages({ 1: null, 2: null, 3: null, 4: null })
            setClothingSizes([])
            setAiUsed(false)
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })} className="text-slate-500 mb-28">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">Add New <span className="text-slate-800 font-medium">Products</span></h1>
            <p className="mt-6 sm:mt-8 text-slate-700 font-medium">Product Images</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4">
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`images${key}`}>
                        <Image
                            width={300}
                            height={300}
                            className='h-20 sm:h-24 w-full object-cover border-2 border-slate-200 rounded-lg cursor-pointer hover:border-slate-300 transition-colors'
                            src={images[key] ? URL.createObjectURL(images[key]) : assets.upload_area}
                            alt=""
                        />
                        <input
                            type="file"
                            accept='image/*'
                            id={`images${key}`}
                            onChange={e => handleImageUpload(key, e.target.files[0])}
                            hidden
                        />
                    </label>
                ))}
            </div>

            <label className="flex flex-col gap-2 my-6">
                <span className="font-medium text-slate-700">Product Name</span>
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Enter product name" className="w-full p-2.5 px-4 outline-none border border-slate-200 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-green-500 focus:ring-opacity-10 transition-all" required />
            </label>

            <label className="flex flex-col gap-2 my-6">
                <span className="font-medium text-slate-700">Description</span>
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Enter product description" rows={4} className="w-full p-2.5 px-4 outline-none border border-slate-200 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-green-500 focus:ring-opacity-10 transition-all resize-none" required />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <label className="flex flex-col gap-2">
                    <span className="font-medium text-slate-700">Actual Price (₹)</span>
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0" className="w-full p-2.5 px-4 outline-none border border-slate-200 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-green-500 focus:ring-opacity-10 transition-all" required />
                </label>
                <label className="flex flex-col gap-2">
                    <span className="font-medium text-slate-700">Offer Price (₹)</span>
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="0" className="w-full p-2.5 px-4 outline-none border border-slate-200 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-green-500 focus:ring-opacity-10 transition-all" required />
                </label>
            </div>

            <label className="flex flex-col gap-2 my-6">
                <span className="font-medium text-slate-700">Category</span>
                <select onChange={e => setProductInfo({ ...productInfo, category: e.target.value })} value={productInfo.category} className="w-full p-2.5 px-4 outline-none border border-slate-200 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-green-500 focus:ring-opacity-10 transition-all" required>
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </label>

            {/* Clothing Product Toggle */}
            <div className="my-6 p-4 border border-slate-200 rounded-lg">
                <label className="flex items-center gap-3">
                    <input 
                        type="checkbox" 
                        name="isClothing" 
                        checked={productInfo.isClothing} 
                        onChange={onChangeHandler}
                        className="w-5 h-5 cursor-pointer"
                    />
                    <span className="font-medium text-slate-700">This is a Clothing Product</span>
                </label>
                <p className="text-xs text-slate-500 mt-2">Enable this for clothing items to add size variants</p>
            </div>

            {/* Stock Units for Non-Clothing Products */}
            {!productInfo.isClothing && (
                <label className="flex flex-col gap-2 my-6">
                    <span className="font-medium text-slate-700">Available Units</span>
                    <input 
                        type="number" 
                        name="units" 
                        onChange={onChangeHandler} 
                        value={productInfo.units} 
                        placeholder="0" 
                        className="w-full p-2.5 px-4 outline-none border border-slate-200 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-green-500 focus:ring-opacity-10 transition-all" 
                        required 
                    />
                </label>
            )}

            {/* Clothing Sizes Section */}
            {productInfo.isClothing && (
                <div className="my-6 p-5 border-2 border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-800">Clothing Sizes & Stock</h3>
                        <button 
                            type="button"
                            onClick={addClothingSize}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all btn-animate"
                        >
                            <Plus size={18} /> Add Size
                        </button>
                    </div>

                    {clothingSizes.length === 0 ? (
                        <p className="text-slate-600 text-sm">No sizes added yet. Click "Add Size" to start.</p>
                    ) : (
                        <div className="space-y-3">
                            {clothingSizes.map((sizeItem, index) => (
                                <div key={index} className="flex gap-3 items-end bg-white p-3 rounded-lg border border-slate-200">
                                    <div className="flex-1">
                                        <label className="text-xs font-medium text-slate-600">Size</label>
                                        <select 
                                            value={sizeItem.size}
                                            onChange={(e) => updateClothingSize(index, 'size', e.target.value)}
                                            className="w-full p-2 px-3 outline-none border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:ring-opacity-10"
                                        >
                                            <option value="">Select Size</option>
                                            {CLOTHING_SIZES.map((size) => (
                                                <option key={size} value={size}>{size}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-medium text-slate-600">Units Available</label>
                                        <input 
                                            type="number" 
                                            min="1"
                                            value={sizeItem.units}
                                            onChange={(e) => updateClothingSize(index, 'units', e.target.value)}
                                            placeholder="0"
                                            className="w-full p-2 px-3 outline-none border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:ring-opacity-10"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeClothingSize(index)}
                                        className="p-2.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <button disabled={loading} className="w-full sm:w-auto bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 sm:px-8 py-2.5 mt-8 rounded-lg hover:shadow-lg active:scale-95 btn-animate transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Adding..." : "Add Product"}
            </button>
        </form>
    )
}

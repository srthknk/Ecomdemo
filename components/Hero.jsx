'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {
    const [settings, setSettings] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get('/api/admin/settings')
                setSettings(res.data)
            } catch (error) {
                console.error('Error fetching settings:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSettings()
    }, [])

    const handleBannerClick = (link) => {
        if (link && link !== '#') {
            router.push(link)
        }
    }

    if (loading) {
        return (
            <div className='mx-6'>
                <div className='w-full space-y-4 max-w-7xl mx-auto my-10'>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className='h-64 sm:h-80 bg-slate-200 rounded-lg animate-pulse'></div>
                    ))}
                </div>
            </div>
        )
    }

    const banners = [
        {
            image: settings?.bannerImage1,
            title: settings?.bannerTitle1,
            link: settings?.bannerLink1 || '/shop'
        },
        {
            image: settings?.bannerImage2,
            title: settings?.bannerTitle2,
            link: settings?.bannerLink2 || '/shop'
        },
        {
            image: settings?.bannerImage3,
            title: settings?.bannerTitle3,
            link: settings?.bannerLink3 || '/shop'
        }
    ]

    return (
        <div className='mx-2 sm:mx-4 md:mx-6'>
            {/* Banners Section */}
            <div className='max-w-7xl mx-auto my-6 sm:my-8 md:my-10'>
                <div className='space-y-3 sm:space-y-4 md:space-y-6'>
                    {banners.map((banner, index) => (
                        <div
                            key={index}
                            onClick={() => handleBannerClick(banner.link)}
                            className='relative h-32 xs:h-40 sm:h-56 md:h-72 lg:h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group w-full'
                        >
                            {/* Banner Image */}
                            {banner.image ? (
                                <Image
                                    src={banner.image}
                                    alt={banner.title || `Banner ${index + 1}`}
                                    fill
                                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px'
                                    className='object-cover object-center group-hover:scale-105 transition-transform duration-300 w-full h-full'
                                    priority={index === 0}
                                />
                            ) : (
                                <div className='w-full h-full bg-gradient-to-r from-indigo-400 to-blue-400 flex items-center justify-center'>
                                    <p className='text-white text-lg font-semibold'>Banner {index + 1}</p>
                                </div>
                            )}

                            {/* Overlay */}
                            <div className='absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300'></div>

                            {/* Content */}
                            <div className='absolute inset-0 flex flex-col items-center justify-center text-center px-3 sm:px-4 md:px-6'>
                                {banner.title && (
                                    <h2 className='text-base xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4 drop-shadow-lg line-clamp-2'>
                                        {banner.title}
                                    </h2>
                                )}
                                <button
                                    onClick={() => handleBannerClick(banner.link)}
                                    className='px-3 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm md:text-base font-semibold rounded-lg transition-colors duration-300 shadow-md'
                                >
                                    Shop Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <CategoriesMarquee />
        </div>
    )
}

export default Hero
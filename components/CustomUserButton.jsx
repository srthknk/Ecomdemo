'use client'
import { useUser, useAuth, UserButton } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { LayoutDashboard, Store } from "lucide-react"

export default function CustomUserButton({ children }) {
    const { user } = useUser()
    const { getToken } = useAuth()
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState(false)
    const [hasStore, setHasStore] = useState(false)

    useEffect(() => {
        const checkRoles = async () => {
            if (!user) return

            try {
                const token = await getToken()

                // Check if admin
                const adminRes = await axios.get('/api/admin/is-admin', {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: { isAdmin: false } }))
                
                if (adminRes?.data?.isAdmin) {
                    setIsAdmin(true)
                    console.log('✅ User is Admin')
                }

                // Check if seller
                const sellerRes = await axios.get('/api/store/is-seller', {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: { isSeller: false, storeId: null } }))
                
                console.log('🔍 Seller Response:', sellerRes?.data)
                
                if (sellerRes?.data?.isSeller && sellerRes?.data?.storeId) {
                    setHasStore(true)
                    console.log('✅ User has Store')
                }
            } catch (error) {
                console.error('Error checking roles:', error)
            }
        }

        checkRoles()
    }, [user, getToken])

    return (
        <UserButton>
            <UserButton.MenuItems>
                {children}
                {isAdmin && (
                    <UserButton.Action 
                        labelIcon={<LayoutDashboard size={16}/>} 
                        label="Admin Panel" 
                        onClick={() => router.push('/admin')}
                    />
                )}
                {hasStore && (
                    <UserButton.Action 
                        labelIcon={<Store size={16}/>} 
                        label="My Store" 
                        onClick={() => router.push('/store')}
                    />
                )}
            </UserButton.MenuItems>
        </UserButton>
    )
}

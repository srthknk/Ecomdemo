import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import WebsiteTitleUpdater from "@/components/WebsiteTitleUpdater";
import { StoreTitle } from "@/components/StoreTitle";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import prisma from "@/lib/prisma";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

// Fetch settings server-side for metadata
export async function generateMetadata() {
    try {
        const settings = await prisma.settings.findUnique({
            where: { id: "default" }
        })
        
        const title = settings?.storeName || "GoCart | Official Store"
        const description = settings?.storeName || "GoCart | Official Store"
        
        return {
            title: title,
            description: description,
        }
    } catch (error) {
        return {
            title: "GoCart | Official Store",
            description: "GoCart | Official Store",
        }
    }
}

export default function RootLayout({ children }) {
    return (
        <ClerkProvider 
            appearance={{
                layout: {
                    logoImageUrl: '',
                    socialButtonsVariant: 'iconButton',
                }
            }}
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
            <html lang="en">
                <body className={`${outfit.className} antialiased`}>
                    <StoreProvider>
                        <StoreTitle />
                        <WebsiteTitleUpdater />
                        <Toaster />
                        {children}
                    </StoreProvider>
                    {/* Razorpay Payment Gateway */}
                    <Script 
                        src="https://checkout.razorpay.com/v1/checkout.js" 
                        strategy="lazyOnload"
                    />
                </body>
            </html>
        </ClerkProvider>
    );
}

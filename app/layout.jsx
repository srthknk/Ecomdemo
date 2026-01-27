import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "GoCart. - Shop smarter",
    description: "GoCart. - Shop smarter",
};

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

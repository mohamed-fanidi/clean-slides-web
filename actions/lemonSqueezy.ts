'use server'

import { lemonSqueezyClient } from "@/lib/axios"
import { data } from "@/lib/constants"


export const buySubscription = async (buyUserId: string) => {
    console.log({
  apiKeyExists: !!process.env.LEMON_SQUEEZY_API_KEY,
  apiKeyLength: process.env.LEMON_SQUEEZY_API_KEY?.length,
  storeId: process.env.LEMON_SQUEEZY_STORE_ID,
  variantId: process.env.LEMON_SQUEEZY_VARIANT_ID,
})
    try{
        const res = await lemonSqueezyClient(
            process.env.LEMON_SQUEEZY_API_KEY
        ).post('/checkouts',{
            data: {
                type: 'checkouts',
                attributes: {
                    checkout_data: {
                        custom: {
                            buyerUserId: buyUserId,
                        },
                    },
                    product_option: {
                        redirect_url: `${process.env.NEXT_PUBLIC_HOST_URL}/dashboard`,
                    },
                },
                relationships: {
                    store: {
                        data: {
                            type: 'stores',
                            id: process.env.LEMON_SQUEEZY_STORE_ID, //users store ID
                        },
                    },
                    variant: {
                        data: {
                            type: 'variants',
                            id: process.env.LEMON_SQUEEZY_VARIANT_ID, 
                        },
                    },
                },
            },
        })
        

        

        const checkoutUrl = res.data.data.attributes.url
        return { url: checkoutUrl, status: 200 }

    } catch (error) {
    console.error('ERROR', error)

    return {
        message: 'Internal Server Error',
        status: 500,
    }
}

}
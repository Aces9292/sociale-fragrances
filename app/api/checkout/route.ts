import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { validateDiscountCode } from '@/lib/discounts';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

interface CartItem {
  name: string;
  size: string;
  price: number;
  quantity: number;
  image?: string;
}

export async function POST(request: Request) {
  try {
    const { items, successUrl, cancelUrl, discountCode, discountAmount } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum: number, item: CartItem) => 
      sum + (item.price * item.quantity), 0
    );

    // Validate discount if provided
    let finalDiscount = 0;
    if (discountCode && discountAmount) {
      const validation = validateDiscountCode(discountCode, subtotal);
      if (validation.valid && validation.discount === discountAmount) {
        finalDiscount = discountAmount;
      }
    }

    // Create line items for Stripe
    const lineItems = items.map((item: CartItem) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.name} - ${item.size}`,
          ...(item.image?.startsWith('http') ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add discount as a line item if applicable
    if (finalDiscount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Discount (${discountCode})`,
          },
          unit_amount: -Math.round(finalDiscount * 100), // Negative for discount
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `https://socialefragrances.com/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `https://socialefragrances.com/cart`,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount' as const,
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
            display_name: 'Free Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day' as const,
                value: 5,
              },
              maximum: {
                unit: 'business_day' as const,
                value: 7,
              },
            },
          },
        },
      ],
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
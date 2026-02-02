import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

// Initialize Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});
// Webhook secret from environment variables
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Handle POST requests to the Stripe webhook endpoint
export async function POST(request: Request) {
  // Read the raw body and signature from headers
  try {
    // Read raw body
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');
    //
    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }
    // Declare event variable
    let event: Stripe.Event;

    // Verify webhook signature (if webhook secret is configured)
    if (webhookSecret) {
      // Construct event with signature verification
      try {
        // Verify the event came from Stripe
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        // Signature verification failed
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json(
          { error: 'Webhook signature verification failed' },
          { status: 400 }
        );
      }
    } else {
      // For development without webhook secret
      event = JSON.parse(body);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Retrieve session with line items
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items', 'line_items.data.price.product'],
      });
      // Extract metadata and line items
      const metadata = fullSession.metadata;
      const lineItems = fullSession.line_items?.data || [];
      // Ensure userId is present in metadata
      if (!metadata?.userId) {
        console.error('No userId in metadata');
        return NextResponse.json({ received: true });
      }

      // Create order items from line items
      const orderItems = [];
      // Iterate over each line item
      for (const item of lineItems) {
        let productName = 'Unknown product';
        // Extract product name from expanded product data
        if (typeof item.price?.product === 'object' && item.price.product && !item.price.product.deleted) {
          productName = item.price.product.name || 'Unknown product';
        }
        
        // Try to find product by name
        const product = await prisma.product.findFirst({
          where: { name: productName },
        }); 
        // If product found, prepare order item
        if (product) {
          orderItems.push({
            productId: product.id,
            quantity: item.quantity || 1,
            price: (item.amount_total || 0) / 100,
          });
        }
      }

      // Create order in database
      await prisma.order.create({
        data: {
          userId: metadata.userId,
          total: (fullSession.amount_total || 0) / 100,
          shippingName: metadata.shippingName || '',
          shippingEmail: metadata.shippingEmail || '',
          shippingAddress: metadata.shippingAddress || '',
          status: 'PROCESSING',
          stripePaymentId: session.payment_intent as string,
          items: {
            create: orderItems,
          },
        },
      });

      // Clear user's cart
      await prisma.cartItem.deleteMany({
        where: { userId: metadata.userId },
      });

      console.log('Order created successfully for session:', session.id);
    }
    // Return a 200 response to acknowledge receipt of the event
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 500 }
    );
  }
}

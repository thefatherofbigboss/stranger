import { NextRequest, NextResponse } from 'next/server';
import { getRazorpayInstance, getRazorpayKeyId } from '@/lib/razorpay';
import { getEventById, createBooking } from '@/lib/events';
import { createOrUpdateUserProfile } from '@/lib/userProfile';
import { createServerClient } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { eventId, name, phone, email } = body;

        // Validate required fields
        if (!eventId || !name || !phone) {
            return NextResponse.json(
                { error: 'Missing required fields: eventId, name, and phone are required' },
                { status: 400 }
            );
        }

        // Validate phone number format (basic validation)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
            return NextResponse.json(
                { error: 'Invalid phone number format' },
                { status: 400 }
            );
        }

        // Get event details
        const event = await getEventById(eventId);
        if (!event) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        // Check if event is sold out
        if (event.available_seats <= event.booked_spots) {
            return NextResponse.json(
                { error: 'Event is sold out' },
                { status: 400 }
            );
        }

        // Check if event is live
        if (event.status !== 'live') {
            return NextResponse.json(
                { error: 'Event is not available for booking' },
                { status: 400 }
            );
        }

        // Calculate price (discounted_price if available, else regular_price)
        const price = event.discounted_price && event.discounted_price < event.regular_price
            ? event.discounted_price
            : event.regular_price;

        // Convert price to paise (Razorpay uses smallest currency unit)
        const amountInPaise = Math.round(price * 100);

        // Create or update user profile
        const supabase = createServerClient();
        // For now, we'll use null for user_id since we're not implementing auth yet
        // In the future, you can get user_id from the session
        const userProfile = await createOrUpdateUserProfile({
            phone: phone.replace(/\D/g, ''), // Remove non-digits
            name,
            email: email || null,
            user_id: null, // TODO: Get from auth session when implemented
        });

        if (!userProfile) {
            return NextResponse.json(
                { error: 'Failed to create user profile' },
                { status: 500 }
            );
        }

        // Create Razorpay order
        const razorpay = getRazorpayInstance();
        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `event_${eventId}_${Date.now()}`,
            notes: {
                event_id: eventId,
                event_name: event.event_name,
                user_name: name,
                user_phone: phone,
            },
        });

        // Create payment_details record with status 'pending'
        const paymentDetail = await createBooking({
            event_id: eventId,
            user_id: null, // TODO: Get from auth session when implemented
            guest_email: email || null,
            guest_phone: phone.replace(/\D/g, ''),
            spots_booked: 1, // Default to 1 spot per booking
            amount_paid: price,
            payment_status: 'pending',
            razorpay_order_id: order.id,
            razorpay_payment_id: null,
        });

        if (!paymentDetail) {
            return NextResponse.json(
                { error: 'Failed to create payment record' },
                { status: 500 }
            );
        }

        // Return order details to client
        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: getRazorpayKeyId(),
            paymentDetailId: paymentDetail.id,
        });
    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create order' },
            { status: 500 }
        );
    }
}

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
        let razorpay;
        try {
            razorpay = getRazorpayInstance();
        } catch (razorpayError: any) {
            console.error('Failed to initialize Razorpay:', razorpayError);
            return NextResponse.json(
                { error: 'Payment gateway configuration error. Please check Razorpay keys.' },
                { status: 500 }
            );
        }

        let order;
        try {
            // Generate receipt ID (max 40 characters for Razorpay)
            // Format: EVT-{shortEventId}-{timestamp}
            // Use first 8 chars of eventId UUID and last 8 digits of timestamp
            const shortEventId = eventId.substring(0, 8);
            const timestamp = Date.now().toString().slice(-8);
            const receipt = `EVT-${shortEventId}-${timestamp}`;
            
            order = await razorpay.orders.create({
                amount: amountInPaise,
                currency: 'INR',
                receipt: receipt,
                notes: {
                    event_id: eventId,
                    event_name: event.event_name,
                    user_name: name,
                    user_phone: phone,
                },
            });
        } catch (razorpayOrderError: any) {
            console.error('Failed to create Razorpay order:', razorpayOrderError);
            return NextResponse.json(
                { 
                    error: razorpayOrderError.error?.description || 'Failed to create payment order',
                    details: razorpayOrderError.error
                },
                { status: 500 }
            );
        }

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
            console.error('Failed to create payment_detail record. Check server logs for details.');
            return NextResponse.json(
                { 
                    error: 'Failed to create payment record',
                    hint: 'Check server logs for detailed error information. This might be due to RLS policies or database constraints.'
                },
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
        console.error('Error stack:', error.stack);
        console.error('Error details:', {
            message: error.message,
            name: error.name,
            code: error.code,
        });
        
        // Provide more detailed error message
        let errorMessage = 'Failed to create order';
        if (error.message) {
            errorMessage = error.message;
        } else if (error.error?.description) {
            errorMessage = error.error.description;
        }
        
        return NextResponse.json(
            { 
                error: errorMessage,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

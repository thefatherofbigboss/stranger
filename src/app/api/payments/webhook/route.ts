import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { createServerClient } from '@/lib/supabaseClient';
import { getEventById } from '@/lib/events';

export async function POST(request: NextRequest) {
    try {
        // Get webhook secret from environment
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error('RAZORPAY_WEBHOOK_SECRET is not configured');
            return NextResponse.json(
                { error: 'Webhook secret not configured' },
                { status: 500 }
            );
        }

        // Get the raw body for signature verification
        const body = await request.text();
        const signature = request.headers.get('x-razorpay-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'Missing signature' },
                { status: 400 }
            );
        }

        // Verify webhook signature
        const isValid = verifyWebhookSignature(webhookSecret, body, signature);
        if (!isValid) {
            console.error('Invalid webhook signature');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            );
        }

        // Parse the webhook payload
        const payload = JSON.parse(body);
        const event = payload.event;
        const payment = payload.payload?.payment?.entity;

        if (!payment) {
            return NextResponse.json(
                { error: 'Invalid webhook payload' },
                { status: 400 }
            );
        }

        const supabase = createServerClient();

        // Handle payment.captured event
        if (event === 'payment.captured') {
            const orderId = payment.order_id;
            const paymentId = payment.id;
            const amount = payment.amount / 100; // Convert from paise to rupees

            // Find the payment_details record by razorpay_order_id
            const { data: paymentDetail, error: fetchError } = await supabase
                .from('payment_details')
                .select('*')
                .eq('razorpay_order_id', orderId)
                .single();

            if (fetchError || !paymentDetail) {
                console.error('Payment detail not found for order:', orderId);
                return NextResponse.json(
                    { error: 'Payment detail not found' },
                    { status: 404 }
                );
            }

            // Check if already processed
            if (paymentDetail.payment_status === 'completed') {
            return NextResponse.json({ status: 'ok' });
            }

            // Verify amount matches
            if (Math.abs(paymentDetail.amount_paid - amount) > 0.01) {
                console.error('Amount mismatch:', paymentDetail.amount_paid, amount);
                return NextResponse.json(
                    { error: 'Amount mismatch' },
                    { status: 400 }
                );
            }

            // Get event to check availability
            const event = await getEventById(paymentDetail.event_id);
            if (!event) {
                console.error('Event not found for payment:', paymentDetail.event_id);
                return NextResponse.json(
                    { error: 'Event not found' },
                    { status: 404 }
                );
            }

            // Check availability before incrementing (double-check)
            if (event.available_seats <= event.booked_spots) {
                console.error('Event sold out, cannot complete payment:', paymentDetail.event_id);
                // Update payment status to failed
                await supabase
                    .from('payment_details')
                    .update({
                        payment_status: 'failed',
                        razorpay_payment_id: paymentId,
                    })
                    .eq('id', paymentDetail.id);
                return NextResponse.json(
                    { error: 'Event sold out' },
                    { status: 400 }
                );
            }

            // Atomically increment booked_spots using RPC function
            const { data: incrementResult, error: rpcError } = await supabase.rpc(
                'increment_booked_spots_safe',
                {
                    p_event_id: paymentDetail.event_id,
                    p_spots: paymentDetail.spots_booked,
                }
            );

            if (rpcError || !incrementResult) {
                console.error('Failed to increment booked spots:', rpcError);
                // Update payment status to failed
                await supabase
                    .from('payment_details')
                    .update({
                        payment_status: 'failed',
                        razorpay_payment_id: paymentId,
                    })
                    .eq('id', paymentDetail.id);
                return NextResponse.json(
                    { error: 'Failed to book seats' },
                    { status: 500 }
                );
            }

            // Update payment_details with payment_id and status
            const { error: updateError } = await supabase
                .from('payment_details')
                .update({
                    payment_status: 'completed',
                    razorpay_payment_id: paymentId,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', paymentDetail.id);

            if (updateError) {
                console.error('Error updating payment detail:', updateError);
                return NextResponse.json(
                    { error: 'Failed to update payment detail' },
                    { status: 500 }
                );
            }

            return NextResponse.json({ status: 'ok' });
        }

        // Handle payment.failed event
        if (event === 'payment.failed') {
            const orderId = payment.order_id;
            const paymentId = payment.id;

            // Update payment_details status to failed
            const { error: updateError } = await supabase
                .from('payment_details')
                .update({
                    payment_status: 'failed',
                    razorpay_payment_id: paymentId,
                    updated_at: new Date().toISOString(),
                })
                .eq('razorpay_order_id', orderId);

            if (updateError) {
                console.error('Error updating failed payment:', updateError);
                return NextResponse.json(
                    { error: 'Failed to update payment status' },
                    { status: 500 }
                );
            }

            return NextResponse.json({ status: 'ok' });
        }

        // For other events, just acknowledge
        return NextResponse.json({ status: 'ok' });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: error.message || 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

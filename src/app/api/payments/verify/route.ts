import { NextRequest, NextResponse } from 'next/server';
import { getPaymentRequestDetails } from '@/lib/instamojo';
import { processPaymentSuccess } from '@/lib/payment-utils';
import { createServerClient } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { paymentRequestId, paymentId } = body;

        if (!paymentRequestId || !paymentId) {
            return NextResponse.json(
                { error: 'Missing required fields: paymentRequestId and paymentId' },
                { status: 400 }
            );
        }

        // Fetch payment details from Instamojo
        // This confirms the payment is valid and gets the amount/status directly from source
        const paymentRequest = await getPaymentRequestDetails(paymentRequestId);

        // Verify status
        if (paymentRequest.status !== 'Completed') {
            return NextResponse.json(
                { error: 'Payment not completed', status: paymentRequest.status },
                { status: 400 }
            );
        }

        // Get current user session if available
        const supabase = createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Verify amount and process success logic
        const amount = parseFloat(paymentRequest.amount);

        const result = await processPaymentSuccess({
            paymentRequestId,
            paymentId,
            amount,
            userId: user?.id || null
        });

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to process payment' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            bookingId: result.bookingId,
            message: 'Payment verified and booking confirmed'
        });

    } catch (error: any) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { error: error.message || 'Verification failed' },
            { status: 500 }
        );
    }
}

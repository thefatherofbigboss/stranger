import Razorpay from 'razorpay';

// Initialize Razorpay instance
export function getRazorpayInstance(): Razorpay {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        throw new Error('Razorpay keys are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
    }

    return new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });
}

// Verify webhook signature
export function verifyWebhookSignature(
    webhookSecret: string,
    webhookBody: string,
    signature: string
): boolean {
    const crypto = require('crypto');
    const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(webhookBody)
        .digest('hex');

    return expectedSignature === signature;
}

// Get Razorpay key ID for client-side (public key only)
export function getRazorpayKeyId(): string {
    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!keyId) {
        throw new Error('RAZORPAY_KEY_ID is not configured');
    }
    return keyId;
}

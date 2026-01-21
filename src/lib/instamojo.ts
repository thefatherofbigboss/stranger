import crypto from 'crypto';

type InstamojoEnvironment = {
    apiKey: string;
    authToken: string;
    clientId: string;
    clientSecret: string;
    salt: string;
    baseUrl: string;
    webhookUrl: string;
};

type CreatePaymentRequestPayload = {
    amount: number;
    purpose: string;
    buyer_name: string;
    email?: string | null;
    phone: string;
    redirect_url: string;
    webhook: string;
    allow_repeated_payments?: boolean;
    send_email?: boolean;
    send_sms?: boolean;
    metadata?: Record<string, unknown>;
};

export type InstamojoPaymentRequest = {
    id: string;
    phone: string;
    email: string | null;
    buyer_name: string;
    amount: string;
    purpose: string;
    status: string;
    longurl: string;
    shorturl?: string;
};

function getEnvConfig(): InstamojoEnvironment {
    const {
        INSTAMOJO_API_KEY,
        INSTAMOJO_AUTH_TOKEN,
        INSTAMOJO_CLIENT_ID,
        INSTAMOJO_CLIENT_SECRET,
        INSTAMOJO_SALT,
        INSTAMOJO_BASE_URL,
    } = process.env;

    const missing = [];
    if (!INSTAMOJO_API_KEY) missing.push('INSTAMOJO_API_KEY');
    if (!INSTAMOJO_AUTH_TOKEN) missing.push('INSTAMOJO_AUTH_TOKEN');
    if (!INSTAMOJO_CLIENT_ID) missing.push('INSTAMOJO_CLIENT_ID');
    if (!INSTAMOJO_CLIENT_SECRET) missing.push('INSTAMOJO_CLIENT_SECRET');
    if (!INSTAMOJO_SALT) missing.push('INSTAMOJO_SALT');

    if (missing.length) {
        throw new Error(`Instamojo config missing env vars: ${missing.join(', ')}`);
    }

    return {
        apiKey: INSTAMOJO_API_KEY!,
        authToken: INSTAMOJO_AUTH_TOKEN!,
        clientId: INSTAMOJO_CLIENT_ID!,
        clientSecret: INSTAMOJO_CLIENT_SECRET!,
        salt: INSTAMOJO_SALT!,
        baseUrl: INSTAMOJO_BASE_URL || 'https://api.instamojo.com',
        webhookUrl: `${process.env.INSTAMOJO_WEBHOOK_URL || 'https://www.strangermingle.com/api/payments/webhook'}`,
    };
}

export async function createPaymentRequest(
    payload: CreatePaymentRequestPayload
): Promise<InstamojoPaymentRequest> {
    const config = getEnvConfig();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
        const response = await fetch(`${config.baseUrl}/v2/payment_requests/`, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': config.apiKey,
                'X-Auth-Token': config.authToken,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(
                `Instamojo payment request failed (${response.status}): ${errorBody}`
            );
        }

        const data = (await response.json()) as InstamojoPaymentRequest;
        if (!data?.id || !data?.longurl) {
            throw new Error('Invalid Instamojo response: missing id or longurl');
        }
        return data;
    } finally {
        clearTimeout(timeout);
    }
}

export function verifyInstamojoSignature({
    rawBody,
    signatureHeader,
    salt,
    mac,
    parsedBody,
}: {
    rawBody: string;
    signatureHeader?: string | null;
    salt: string;
    mac?: string | null;
    parsedBody?: Record<string, any>;
}): boolean {
    // Prefer header-based signature when present (newer flow)
    if (signatureHeader) {
        const expected = crypto
            .createHmac('sha256', salt)
            .update(rawBody, 'utf8')
            .digest('hex');
        return expected === signatureHeader;
    }

    // Legacy MAC verification (sorted fields joined by '|')
    if (mac && parsedBody) {
        const macInput = Object.keys(parsedBody)
            .filter((key) => key !== 'mac')
            .sort()
            .map((key) => parsedBody[key])
            .join('|');

        const expectedMac = crypto
            .createHmac('sha1', salt)
            .update(macInput)
            .digest('hex');

        return expectedMac === mac;
    }

    return false;
}

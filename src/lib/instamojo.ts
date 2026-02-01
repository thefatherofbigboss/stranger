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

// Simple in-memory cache for the access token
let cachedToken: { token: string; expiresAt: number } | null = null;

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

/**
 * Obtains an OAuth2 access token from Instamojo
 */
async function getAccessToken(config: InstamojoEnvironment): Promise<string> {
    const now = Date.now();

    // Return cached token if still valid (with 5-minute buffer)
    if (cachedToken && cachedToken.expiresAt > now + 300000) {
        return cachedToken.token;
    }

    const payload = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: config.clientId,
        client_secret: config.clientSecret,
    });

    // For production, OAuth endpoints are on www.instamojo.com
    // For sandbox, they are on test.instamojo.com
    const authBaseUrl = config.baseUrl.includes('test')
        ? 'https://test.instamojo.com'
        : 'https://www.instamojo.com';

    const response = await fetch(`${authBaseUrl}/oauth2/token/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload.toString(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to obtain Instamojo access token (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    if (!data.access_token) {
        throw new Error('Instamojo token response did not contain access_token');
    }

    // Cache the token
    cachedToken = {
        token: data.access_token,
        expiresAt: now + (data.expires_in * 1000),
    };

    return data.access_token;
}

export async function createPaymentRequest(
    payload: CreatePaymentRequestPayload
): Promise<InstamojoPaymentRequest> {
    const config = getEnvConfig();
    const accessToken = await getAccessToken(config);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    // Ensure baseUrl doesn't end with slash when joining paths
    const baseUrl = config.baseUrl.endsWith('/') ? config.baseUrl.slice(0, -1) : config.baseUrl;

    try {
        const response = await fetch(`${baseUrl}/v2/payment_requests/`, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
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
    parsedBody?: Record<string, unknown>;
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
            .map((key) => String(parsedBody[key]))
            .join('|');

        const expectedMac = crypto
            .createHmac('sha1', salt)
            .update(macInput)
            .digest('hex');

        return expectedMac === mac;
    }

    return false;
}

export async function getPaymentRequestDetails(id: string): Promise<InstamojoPaymentRequest> {
    const config = getEnvConfig();
    const accessToken = await getAccessToken(config);

    // Ensure baseUrl doesn't end with slash
    const baseUrl = config.baseUrl.endsWith('/') ? config.baseUrl.slice(0, -1) : config.baseUrl;

    const response = await fetch(`${baseUrl}/v2/payment_requests/${id}/`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch payment request details: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

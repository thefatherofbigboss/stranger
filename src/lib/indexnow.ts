/**
 * Utility functions for IndexNow URL submission
 */

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.strangermingle.com';

/**
 * Submit URLs to IndexNow API
 * @param urls Array of relative or absolute URLs to submit
 * @returns Promise with submission result
 */
export async function submitToIndexNow(urls: string[]): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  if (!INDEXNOW_KEY) {
    console.warn('INDEXNOW_KEY is not configured. Skipping IndexNow submission.');
    return {
      success: false,
      error: 'INDEXNOW_KEY is not configured',
    };
  }

  if (!urls || urls.length === 0) {
    return {
      success: false,
      error: 'No URLs provided',
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/api/indexnow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        message: `Successfully submitted ${data.totalUrls} URLs to IndexNow`,
      };
    }

    return {
      success: false,
      error: data.error || 'Unknown error',
    };
  } catch (error) {
    console.error('IndexNow submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Submit a single URL to IndexNow
 */
export async function submitUrlToIndexNow(url: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  return submitToIndexNow([url]);
}

/**
 * Submit multiple URLs in batches (for large lists)
 */
export async function submitUrlsToIndexNowInBatches(
  urls: string[],
  batchSize: number = 100
): Promise<{
  success: boolean;
  totalSubmitted: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let totalSubmitted = 0;

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const result = await submitToIndexNow(batch);

    if (result.success) {
      totalSubmitted += batch.length;
    } else {
      errors.push(`Batch ${i / batchSize + 1}: ${result.error || 'Unknown error'}`);
    }

    // Add a small delay between batches to avoid rate limiting
    if (i + batchSize < urls.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return {
    success: errors.length === 0,
    totalSubmitted,
    errors,
  };
}

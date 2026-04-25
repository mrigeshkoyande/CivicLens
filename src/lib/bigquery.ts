import { BigQuery } from '@google-cloud/bigquery';

export interface AnalyticsEvent {
  eventName: string;
  timestamp: string;
  userId?: string;
  properties?: Record<string, unknown>;
}

// Initialize BigQuery client only on the server
const bigquery = typeof window === 'undefined' ? new BigQuery() : null;

export async function logAnalyticsEvent(event: AnalyticsEvent): Promise<void> {
  // If we are on the client, or if GCP credentials aren't set, fallback gracefully
  if (!bigquery || !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.warn("[BigQuery Fallback] Analytics event not logged to GCP:", event.eventName);
    return;
  }

  try {
    const dataset = bigquery.dataset('civiclens_analytics');
    const table = dataset.table('events');
    
    await table.insert({
      event_name: event.eventName,
      timestamp: bigquery.datetime(event.timestamp),
      user_id: event.userId || 'anonymous',
      properties: JSON.stringify(event.properties || {})
    });
    console.log(`[BigQuery] Successfully logged event: ${event.eventName}`);
  } catch (error) {
    console.error('[BigQuery Integration Error]:', error);
  }
}

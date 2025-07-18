import { DatabaseService } from '../lib/database.js';
import type { StylesResponse } from '../shared/api.js';

export const runtime = 'edge';

export default async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get all styles from database
    const styles = await DatabaseService.getAllStyles();

    // Transform database styles to API format
    const formattedStyles = styles.map(style => ({
      id: style.id,
      name: style.name || '',
      description: style.description || '',
      thumbnail: style.thumbnail || '',
      promptJson: style.promptJson || {},
    }));

    const responseData: StylesResponse = {
      styles: formattedStyles,
    };

    return new Response(JSON.stringify(responseData), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Styles endpoint error:', error);
    
    const responseData: StylesResponse = {
      styles: [],
    };

    return new Response(JSON.stringify(responseData), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 
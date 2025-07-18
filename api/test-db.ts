import { testDatabaseConnection } from '../lib/db.js';

export const runtime = 'edge';

export default async function handler(req: Request) {
  try {
    const dbTest = await testDatabaseConnection();
    
    const responseData = {
      success: true,
      message: 'Database test endpoint',
      timestamp: new Date().toISOString(),
      database: dbTest,
    };

    return new Response(JSON.stringify(responseData, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      }, null, 2),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 
// src/app/api/stream/route.ts
import { NextResponse } from 'next/server';
import { sseEmitter } from '@/lib/mqttServer';

// Simple import of MQTT server to ensure it's initialized
import '@/lib/mqttServer';

export async function GET() {
  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Flag to track if the controller is closed
      let isControllerClosed = false;
      
      // Handle the update events (from HoleData topic)
      const updateHandler = (data: string) => {
        try {
          if (!isControllerClosed) {
            console.log('SSE sending update:', data);
            // Include event type in the SSE message
            controller.enqueue(`event: update\ndata: ${data}\n\n`);
          }
        } catch (error) {
          console.error('SSE update error:', error);
          isControllerClosed = true;
          cleanup();
        }
      };
      
      // Handle log events (from events/log topic)
      const logHandler = (message: any) => {
        try {
          if (!isControllerClosed) {
            console.log('SSE sending log message:', message);
            // Include event type in the SSE message
            controller.enqueue(`event: log\ndata: ${message}\n\n`);
          }
        } catch (error) {
          console.error('SSE log error:', error);
          isControllerClosed = true;
          cleanup();
        }
      };
      
      // Clean up function for removing event listeners
      const cleanup = () => {
        sseEmitter.off('update', updateHandler);
        sseEmitter.off('log', logHandler);
        console.log('SSE listeners removed');
      };
      
      // Register event listeners
      sseEmitter.on('update', updateHandler);
      sseEmitter.on('log', logHandler);
      
      // Clean up when the client disconnects
      if (controller.signal) {
        controller.signal.addEventListener('abort', () => {
          console.log('SSE connection aborted');
          isControllerClosed = true;
          cleanup();
        });
      }
    }
  });

  // Return the stream with appropriate headers
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
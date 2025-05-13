// src/hooks/useLiveUpdates.ts
'use client'
import { useEffect, useRef, useCallback } from 'react'

export function useLiveUpdates(cb: (data: any) => void) {
  // Use a ref to track the EventSource instance
  const eventSourceRef = useRef<EventSource | null>(null);
  // Track connection status to prevent multiple reconnection attempts
  const isConnectingRef = useRef<boolean>(false);

  const setupEventSource = useCallback(() => {
    if (isConnectingRef.current) return;
    isConnectingRef.current = true;

    // Close any existing connection
    if (eventSourceRef.current) {
      console.log('[SSE] Closing existing EventSource connection');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // Create new EventSource connection
    console.log('[SSE] Creating new EventSource connection to /api/stream');
    try {
      const es = new EventSource('/api/stream');
      eventSourceRef.current = es;

      es.onopen = () => {
        console.log('[SSE] Connection opened');
        isConnectingRef.current = false;
      };

      // Handle incoming messages
      es.onmessage = (evt) => {
        try {
          const parsed = JSON.parse(evt.data);
          cb(parsed);
        } catch (error) {
          console.error('[SSE] Error parsing message:', error);
        }
      };

      // Handle errors
      es.onerror = (error) => {
        console.error('[SSE] EventSource error:', error);
        // Only attempt to reconnect if we're not already connecting
        if (!isConnectingRef.current) {
          isConnectingRef.current = true;
          es.close();
          eventSourceRef.current = null;
          
          // Try to reconnect after a delay
          setTimeout(() => {
            isConnectingRef.current = false;
            setupEventSource();
          }, 3000);
        }
      };
    } catch (error) {
      console.error('[SSE] Error creating EventSource:', error);
      isConnectingRef.current = false;
    }
  }, [cb]);

  useEffect(() => {
    setupEventSource();
    
    // Cleanup function
    return () => {
      if (eventSourceRef.current) {
        console.log('[SSE] Cleaning up EventSource connection');
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      isConnectingRef.current = false;
    };
  }, [setupEventSource]);
}
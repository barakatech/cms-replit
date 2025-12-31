import { useState, useEffect, useCallback, useRef } from 'react';
import type { UserPresence, PresenceMessage } from '@shared/schema';

interface UsePresenceOptions {
  userId: string;
  userName: string;
  userColor: string;
  contentType: 'stock' | 'blog' | 'banner' | 'discover';
  contentId: string;
  avatarUrl?: string;
}

export function usePresence(options: UsePresenceOptions) {
  const [presences, setPresences] = useState<UserPresence[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [myPresenceId, setMyPresenceId] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/presence`;
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        
        const joinMessage: PresenceMessage = {
          type: 'join',
          presence: {
            id: '',
            userId: options.userId,
            userName: options.userName,
            userColor: options.userColor,
            avatarUrl: options.avatarUrl,
            contentType: options.contentType,
            contentId: options.contentId,
            lastActive: Date.now(),
          },
          timestamp: Date.now(),
        };
        ws.send(JSON.stringify(joinMessage));

        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }));
          }
        }, 10000);
      };

      ws.onmessage = (event) => {
        try {
          const message: PresenceMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'sync':
              if (message.presences) {
                setPresences(message.presences);
              }
              // Server sends back our assigned presence ID
              if (message.presence && message.presence.userId === options.userId) {
                setMyPresenceId(message.presence.id);
              }
              break;
            case 'join':
              if (message.presence) {
                setPresences(prev => [...prev.filter(p => p.id !== message.presence!.id), message.presence!]);
              }
              break;
            case 'update':
              if (message.presence) {
                setPresences(prev => prev.map(p => p.id === message.presence!.id ? message.presence! : p));
              }
              break;
            case 'leave':
              if (message.presence) {
                setPresences(prev => prev.filter(p => p.id !== message.presence!.id));
              }
              break;
          }
        } catch (error) {
          console.error('Failed to parse presence message:', error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setMyPresenceId(null);
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to presence server:', error);
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    }
  }, [options.userId, options.userName, options.userColor, options.contentType, options.contentId, options.avatarUrl]);

  const updatePresence = useCallback((updates: Partial<Pick<UserPresence, 'field' | 'cursorPosition'>>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const updateMessage: PresenceMessage = {
        type: 'update',
        presence: {
          id: myPresenceId || '',
          userId: options.userId,
          userName: options.userName,
          userColor: options.userColor,
          contentType: options.contentType,
          contentId: options.contentId,
          lastActive: Date.now(),
          ...updates,
        },
        timestamp: Date.now(),
      };
      wsRef.current.send(JSON.stringify(updateMessage));
    }
  }, [myPresenceId, options.userId, options.userName, options.userColor, options.contentType, options.contentId]);

  const leave = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'leave', timestamp: Date.now() }));
      wsRef.current.close();
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      leave();
    };
  }, [connect, leave]);

  // Filter out current user - use both myPresenceId and userId for reliability
  const othersOnSamePage = presences.filter(
    p => p.contentType === options.contentType && 
         p.contentId === options.contentId && 
         p.userId !== options.userId &&
         p.id !== myPresenceId
  );

  const othersOnSameField = (field: string) => 
    othersOnSamePage.filter(p => p.field === field);

  return {
    presences,
    othersOnSamePage,
    othersOnSameField,
    isConnected,
    updatePresence,
    leave,
    myPresenceId,
  };
}

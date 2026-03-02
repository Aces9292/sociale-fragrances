'use client';

import { useState, useEffect } from 'react';

interface Entity {
  entity_id: string;
  state: string;
  last_changed?: string;
  attributes?: Record<string, unknown>;
}

export default function DashboardClient() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [lastUpdate, setLastUpdate] = useState('Never');

  useEffect(() => {
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    
    refreshData();
    const dataInterval = setInterval(refreshData, 30000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(dataInterval);
    };
  }, []);

  const updateTime = () => {
    setCurrentTime(new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }));
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ha-proxy/states');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setEntities(data);
      setConnected(true);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to fetch:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setConnected(false);
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    setEntities([
      { entity_id: 'sensor.living_room_temperature', state: '72', last_changed: new Date().toISOString() },
      { entity_id: 'sensor.bedroom_temperature', state: '70', last_changed: new Date().toISOString() },
      { entity_id: 'light.living_room', state: 'on', last_changed: new Date().toISOString() },
      { entity_id: 'light.kitchen', state: 'off', last_changed: new Date().toISOString() },
      { entity_id: 'light.bedroom', state: 'on', last_changed: new Date().toISOString() },
    ]);
  };

  const temperatureSensors = entities
    .filter(e => e.entity_id.includes('temperature') && !e.entity_id.includes('trend'))
    .slice(0, 4);

  const lights = entities
    .filter(e => e.entity_id.startsWith('light.'))
    .sort((a, b) => a.entity_id.localeCompare(b.entity_id));

  const lightsOn = lights.filter(l => l.state === 'on').length;
  const unavailableCount = entities.filter(e => e.state === 'unavailable').length;

  const recentlyChanged = [...entities]
    .filter(e => e.last_changed)
    .sort((a, b) => new Date(b.last_changed!).getTime() - new Date(a.last_changed!).getTime())
    .slice(0, 10);

  const formatEntityName = (entityId: string) => {
    return entityId
      .split('.')[1]
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const toggleLight = async (light: Entity) => {
    const turnOn = light.state !== 'on';
    
    try {
      await fetch('/api/ha-proxy/services/light/turn_on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_id: light.entity_id })
      });
      
      setEntities(prev => prev.map(e => 
        e.entity_id === light.entity_id ? { ...e, state: turnOn ? 'on' : 'off' } : e
      ));
    } catch (err) {
      console.error('Failed to toggle light:', err);
      alert('Failed to toggle light. Make sure HA is connected.');
    }
  };

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#121212',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          padding: '20px 0 40px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '30px'
        }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 300, letterSpacing: '0.2em', marginBottom: '10px' }}>
            HOME ASSISTANT
          </h1>
          <div style={{ fontSize: '3rem', fontWeight: 200, color: '#FF4500' }}>
            {currentTime}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '10px' }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              marginRight: '8px',
              background: connected ? '#4ade80' : '#ef4444',
              boxShadow: connected ? '0 0 8px #4ade80' : 'none'
            }}></span>
            {connected ? 'Connected' : 'Disconnected'}
          </p>
        </div>

        {loading && !entities.length && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.7)' }}>
            Connecting to Home Assistant...
          </div>
        )}

        {error && !entities.length && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            margin: '20px 0',
            textAlign: 'center'
          }}>
            <h3>Connection Error</h3>
            <p>{error}</p>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {/* Temperature Card */}
          <div style={{
            background: 'rgba(30, 30, 30, 0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '20px',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.7)' }}>
                Climate
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {temperatureSensors.map(sensor => (
                <div key={sensor.entity_id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px'
                }}>
                  <span style={{ fontSize: '0.9rem' }}>{formatEntityName(sensor.entity_id)}</span>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{sensor.state}°F</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lights Card */}
          <div style={{
            background: 'rgba(30, 30, 30, 0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '20px',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.7)' }}>
                Lights ({lightsOn} on)
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }}>
              {lights.slice(0, 6).map(light => (
                <button
                  key={light.entity_id}
                  onClick={() => toggleLight(light)}
                  style={{
                    padding: '15px',
                    background: light.state === 'on' ? 'rgba(255, 69, 0, 0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${light.state === 'on' ? '#FF4500' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '12px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.85rem', marginBottom: '5px' }}>
                    {formatEntityName(light.entity_id)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                    {light.state}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div style={{
            background: 'rgba(30, 30, 30, 0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '20px',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.7)' }}>
                System Status
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '0.9rem' }}>Total Entities</span>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{entities.length}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '0.9rem' }}>Unavailable</span>
                <span style={{ fontSize: '0.85rem', color: '#ef4444' }}>{unavailableCount}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '0.9rem' }}>Last Update</span>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{lastUpdate}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            background: 'rgba(30, 30, 30, 0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '20px',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.7)' }}>
                Recent Changes
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentlyChanged.slice(0, 5).map(entity => (
                <div key={entity.entity_id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px'
                }}>
                  <span style={{ fontSize: '0.9rem' }}>{formatEntityName(entity.entity_id)}</span>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{entity.state}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={refreshData}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#FF4500',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(255, 69, 0, 0.4)',
            transition: 'transform 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Refresh Data"
        >
          ↻
        </button>
      </div>
    </div>
  );
}
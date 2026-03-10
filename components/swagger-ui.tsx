'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const SwaggerUIComponent = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
});

import 'swagger-ui-react/swagger-ui.css';

export default function SwaggerUI() {
  const [spec, setSpec] = useState<string | object | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpec = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/docs');
        
        if (!response.ok) {
          if (response.status === 401) {
            setError('Authentication required. Please log in as an administrator.');
          } else if (response.status === 403) {
            setError('Admin access required. Only administrators can access API documentation.');
          } else {
            setError('Failed to load API documentation.');
          }
          return;
        }
        
        const data = await response.json();
        setSpec(data);
        setError(null);
      } catch (err) {
        console.error('Error loading Swagger spec:', err);
        setError('Failed to load API documentation. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpec();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading API Documentation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-lg font-semibold mb-2">Access Denied</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <SwaggerUIComponent 
        spec={spec}
        requestInterceptor={(request: any) => {
          // Add authorization header if token is available
          const token = localStorage.getItem('next-auth.accessToken');
          if (token) {
            request.headers.Authorization = `Bearer ${token}`;
          }
          return request;
        }}
      />
    </div>
  );
}

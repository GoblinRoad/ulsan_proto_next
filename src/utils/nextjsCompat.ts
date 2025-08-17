import { createServerClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

interface CookieOptions {
  name: string;
  value: string;
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
    path?: string;
    maxAge?: number;
  };
}

// Next.js 미들웨어에서 사용할 Supabase 클라이언트 생성 함수
export const createSupabaseServerClient = (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          const cookieOptions: CookieOptions = {
            name,
            value,
            options: {
              ...options,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            },
          };

          response.cookies.set(cookieOptions.name, cookieOptions.value, cookieOptions.options);
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );

  return { supabase, response };
};

// Next.js API 라우트에서 사용할 함수
export const getSessionFromServerRequest = async (request: Request) => {
  const cookies = request.headers.get('cookie');
  
  if (!cookies) return null;

  // 쿠키에서 세션 정보 추출
  const sessionCookie = cookies
    .split(';')
    .find(c => c.trim().startsWith('sb-session='));

  if (!sessionCookie) return null;

  try {
    const sessionValue = sessionCookie.split('=')[1];
    return JSON.parse(decodeURIComponent(sessionValue));
  } catch (error) {
    console.error('Failed to parse session from server request:', error);
    return null;
  }
};

// Next.js 페이지에서 서버사이드에서 세션 확인
export const getServerSideSession = async (context: any) => {
  const { req } = context;
  const cookies = req.headers.cookie;
  
  if (!cookies) return null;

  const sessionCookie = cookies
    .split(';')
    .find((c: string) => c.trim().startsWith('sb-session='));

  if (!sessionCookie) return null;

  try {
    const sessionValue = sessionCookie.split('=')[1];
    return JSON.parse(decodeURIComponent(sessionValue));
  } catch (error) {
    console.error('Failed to parse session from server side:', error);
    return null;
  }
};
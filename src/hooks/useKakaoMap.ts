import { useEffect, useState } from 'react';

declare global {
    interface Window {
        kakao: any;
    }
}

const useKakaoMap = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 이미 로드되어 있는지 확인
        if (window.kakao && window.kakao.maps) {
            setIsLoaded(true);
            return;
        }

        const apiKey = import.meta.env.VITE_KAKAOMAP_API_KEY;

        if (!apiKey) {
            setError('카카오맵 API 키가 설정되지 않았습니다.');
            return;
        }

        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
        script.async = true;

        script.onload = () => {
            if (window.kakao && window.kakao.maps) {
                window.kakao.maps.load(() => {
                    setIsLoaded(true);
                });
            } else {
                setError('카카오맵 로드에 실패했습니다.');
            }
        };

        script.onerror = () => {
            setError('카카오맵 스크립트 로드에 실패했습니다.');
        };

        document.head.appendChild(script);

        return () => {
            // 컴포넌트 언마운트 시 스크립트 제거
            document.head.removeChild(script);
        };
    }, []);

    return { isLoaded, error };
};

export default useKakaoMap;
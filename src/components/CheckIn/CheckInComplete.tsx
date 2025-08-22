import React from 'react';
import { Coins } from 'lucide-react';
import { TourApiDetailItem } from '../../types/tourApi';

interface CheckInCompleteProps {
    spotDetail: TourApiDetailItem;
    locationDistance: number | null;
}

const CheckInComplete: React.FC<CheckInCompleteProps> = ({
                                                             spotDetail,
                                                             locationDistance
                                                         }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-500 p-4">
            <div className="max-w-md mx-auto text-center text-white animate-bounceIn">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Coins className="w-10 h-10 coin-spin" />
                </div>
                <h2 className="text-2xl font-bold mb-2">체크인 완료!</h2>
                <p className="text-green-100 mb-4">100 코인을 획득하셨습니다!</p>
                <div className="bg-white/20 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold mb-2">{spotDetail.title}</h3>
                    <p className="text-sm text-green-100">{spotDetail.addr1} {spotDetail.addr2}</p>
                    {locationDistance && (
                        <p className="text-xs text-green-100 mt-1">
                            {locationDistance.toFixed(0)}m 거리에서 인증 완료
                        </p>
                    )}
                </div>
                <p className="text-sm text-green-100">잠시 후 홈 화면으로 이동합니다...</p>
            </div>
        </div>
    );
};

export default CheckInComplete;

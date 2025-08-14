export interface CourseInfo {
  id: number;
  name: string;
  items: string[];
  duration: string;
  color: string; // tailwind gradient colors
}

export const popularCourses: CourseInfo[] = [
  {
    id: 1,
    name: '선사와 명주 여행',
    items: ['반구대암각화', '천전리각석', '트레비어', '유진목장', '언양시장', '복순도가', '석남사'],
    duration: '전일',
    color: 'from-blue-400 to-cyan-400'
  },
  {
    id: 2,
    name: '웰니스&웰빙여행',
    items: ['태화강국가정원', '간절곶', 'Fe01', '진하해수욕장(명선도)', '남창시장', '외고산옹기마을', '대운산 치유의 숲'],
    duration: '전일',
    color: 'from-green-400 to-emerald-400'
  },
  {
    id: 3,
    name: '자연과 예술여행',
    items: ['장생포고래문화특구', '태화강국가정원', '태화루', '중구 문화의 거리', '울산시립미술관'],
    duration: '반일',
    color: 'from-purple-400 to-pink-400'
  },
  {
    id: 4,
    name: '쪽빛바다여행',
    items: ['울산대교전망대', '대왕암공원', '출렁다리', '일산해수욕장', '주전몽돌해변'],
    duration: '반일',
    color: 'from-cyan-400 to-blue-500'
  },
  {
    id: 5,
    name: '독립역사여행',
    items: ['박상진의사생가', '달천철장', '강동몽돌해변', '보성학교전시관'],
    duration: '반일',
    color: 'from-yellow-400 to-orange-400'
  }
];



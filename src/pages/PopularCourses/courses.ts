export interface CourseInfo {
  id: number;
  name: string;
  items: string[];
  duration: string;
  color: string; // tailwind gradient colors
  description: string; // 코스 소개 문구
  detailedDescription: string; // 상세 소개 문구
}

export const popularCourses: CourseInfo[] = [
  {
    id: 1,
    name: '선사와 명주 여행',
    items: ['반구대암각화', '천전리각석', '트레비어', '유진목장', '언양시장', '복순도가', '석남사'],
    duration: '전일',
    color: 'from-blue-400 to-cyan-400',
    description: '시간을 거슬러, 선사시대에서 전통의 향기까지',
    detailedDescription: '선사시대의 숨결이 깃든 반구대암각화와 천전리각석에서 여행은 시작됩니다. 섬세한 돌그림 앞에서 인류의 발자취를 느끼시고, 언양의 트레비어와 유진목장에서 여유를 즐겨보세요. 언양시장에서는 사람 사는 냄새를, 복순도가에서는 전통 술의 깊은 향을, 석남사에서는 고즈넉한 사찰의 평온함을 만나며 하루를 완성하실 수 있습니다.'
  },
  {
    id: 2,
    name: '웰니스&웰빙여행',
    items: ['태화강국가정원', '간절곶', 'Fe01', '진하해수욕장(명선도)', '남창시장', '외고산옹기마을', '대운산 치유의 숲'],
    duration: '전일',
    color: 'from-green-400 to-emerald-400',
    description: '몸과 마음을 쉬게 하는 힐링 코스',
    detailedDescription: '태화강국가정원에서 싱그러운 강변 산책을 즐기시고, 간절곶에서 해안 절경과 함께 탁 트인 바다를 마주하세요. 감각적인 공간 Fe01에서 커피 한 잔의 여유를, 진하해수욕장에서 바람을, 남창시장에서 향토 음식을 맛보실 수 있습니다. 외고산옹기마을의 소박한 흙 냄새와 대운산 치유의 숲에서의 깊은 숨은 온전히 회복의 시간을 선사할 것입니다.'
  },
  {
    id: 3,
    name: '자연과 예술여행',
    items: ['장생포고래문화특구', '태화강국가정원', '태화루', '중구 문화의 거리', '울산시립미술관'],
    duration: '반일',
    color: 'from-purple-400 to-pink-400',
    description: '바다, 강, 그리고 예술이 한 도시에',
    detailedDescription: '장생포고래문화특구에서 고래의 역사와 바다의 이야기를 만나시고, 태화강국가정원과 태화루에서 강과 도심의 조화를 느껴보세요. 중구 문화의 거리를 거닐며 벽화와 아트샵을 구경하시고, 울산시립미술관에서 현대미술의 감각적인 세계로 빠져드는 순간, 울산이 단순한 산업도시가 아님을 깨닫게 되실 것입니다.'
  },
  {
    id: 4,
    name: '쪽빛바다여행',
    items: ['울산대교전망대', '대왕암공원', '출렁다리', '일산해수욕장', '주전몽돌해변'],
    duration: '반일',
    color: 'from-cyan-400 to-blue-500',
    description: '푸른 바다와 절벽이 빚은 드라마',
    detailedDescription: '울산대교전망대에서 도시와 바다가 어우러진 장관을 내려다보시고, 대왕암공원에서 소나무 숲길과 바위 절경을 즐기세요. 출렁다리에서 아찔한 스릴을 느끼신 후, 일산해수욕장과 주전몽돌해변에서 발끝으로 전해지는 시원한 파도 소리에 귀 기울여 보시기 바랍니다.'
  },
  {
    id: 5,
    name: '독립역사여행',
    items: ['박상진의사생가', '달천철장', '강동몽돌해변', '보성학교전시관'],
    duration: '반일',
    color: 'from-yellow-400 to-orange-400',
    description: '조국을 위해 싸운 사람들의 발자취',
    detailedDescription: '박상진 의사의 생가에서 독립운동가의 삶을 느끼시고, 달천철장에서 산업과 역사 이야기를 들어보세요. 강동몽돌해변에서 고요한 바다의 힘을 느끼시고, 보성학교전시관에서 학생들이 꿈꾼 자유와 나라 사랑의 정신을 되새기며 여행을 마무리하실 수 있습니다.'
  }
];



import { TourApiDetailResponse, TourApiIntroResponse, TourApiDetailItem, TourApiIntroItem } from '../types/tourApi';

export interface SpotImage {
  contentid: string;
  originimgurl: string;
  imgname: string;
  smallimageurl: string;
  cpyrhtDivCd: string;
  serialnum: string;
}
import 복순도가이미지 from '../assets/spot/울산_복순도가.png';
import 트레비어이미지 from '../assets/spot/트레비어.jpg';
import fe01이미지 from '../assets/spot/fe01.png';
import 남창옹기종기시장이미지 from '../assets/spot/남창옹기종기시장.jpg';
import 외고산옹기마을이미지 from '../assets/spot/외고산옹기마을.jpg';
import 장생포고래문화특구이미지 from '../assets/spot/장생포고래문화특구.png';
import 울산문화의거리이미지 from '../assets/spot/울산문화의거리.jpg';
import 대왕암출렁다리이미지 from '../assets/spot/대왕암출렁다리.jpg';
import 일산해수욕장이미지 from '../assets/spot/일산해수욕장.jpg';
import 보성학교전시관이미지 from '../assets/spot/보성학교전시관.jpg';

export interface CourseSpotInfo {
  name: string;
  contentId: string;
  lat: number;
  lng: number;
  image: string;
  description: string;
  address: string;
  tel?: string;
  useTime?: string;
  restDate?: string;
  parking?: string;
}

// 코스별 관광지 이름 매핑 (실제 API 검색 가능한 이름으로 수정)
const COURSE_SPOT_MAPPING: Record<string, string[]> = {
  '선사와 명주 여행': [
    '반구대 암각화', '천전리각석', '트레비어', '유진목장', '언양알프스시장', '복순도가', '석남사'
  ],
  '웰니스&웰빙여행': [
    '태화강국가정원', '간절곶', 'Fe01', '진하해수욕장', '남창옹기종기시장', '외고산 옹기마을', '국립대운산치유의숲'
  ],
  '자연과 예술여행': [
    '장생포고래문화특구', '태화강국가정원', '태화루', '울산 문화의거리', '울산시립미술관'
  ],
  '쪽빛바다여행': [
    '울산대교 전망대', '대왕암공원', '출렁다리', '일산해수욕장', '주전몽돌해변'
  ],
  '독립역사여행': [
    '박상진의사 생가', '달천철장', '강동몽돌해변', '보성학교전시관'
  ]
};

// 관광지 이름으로 검색하는 함수 (searchKeyword2 사용)
export async function searchSpotByName(spotName: string): Promise<CourseSpotInfo | null> {
  // 보성학교 전시관은 하드코딩된 정보 사용
  if (spotName === '보성학교전시관') {
    return {
      name: '보성학교 전시관',
      contentId: 'hardcoded_boseong',
      lat: 35.500249,
      lng: 129.432236,
      image: 보성학교전시관이미지,
      description: '울산광역시 동구에는 성세빈 선생이 세운 사립학교 울산 보성학교 터가 남아 있다. 울산 보성학교는 1909년 이전에 설립되었다가 일제의 탄압에 의해 폐교한 후 1922년 성세빈 선생의 노력과 지역민들의 기부금을 바탕으로 사립학교로 다시 문을 열었다. 울산 보성학교는 사립 교육 기관이면서도 항일 운동에 적극적으로 참여하는 등 사회 운동의 중심지 역할을 담당했다. 현재는 건물이 소실되어 자취를 찾아볼 수 없지만 \'보성학교 전시관\'을 방문하면 울산 보성학교의 역사와 울산 지역 독립운동사를 확인할 수 있다.',
      address: '울산광역시 일산진7길 8',
      tel: '0522093314',
      useTime: '오전 9:00~오후 6:00',
      restDate: '1월 1일, 매주 월요일 , 설날 연휴, 추석 연휴',
      parking: '가능'
    };
  }

  const serviceKey = import.meta.env.VITE_TOURAPI_KEY;
  
  if (!serviceKey) {
    console.error('Tour API 키가 설정되지 않았습니다.');
    return null;
  }

  try {
    // 검색 API 호출 (searchKeyword2) - contentTypeId 제거하여 모든 유형 검색
    const searchParams = new URLSearchParams({
      serviceKey: decodeURIComponent(serviceKey),
      pageNo: '1',
      numOfRows: '10',
      MobileOS: 'WEB',
      MobileApp: 'Ulsan',
      _type: 'json',
      arrange: 'A', // 정확도순
      keyword: spotName,
      areaCode: '7' // 울산광역시
    });

    const searchUrl = `https://apis.data.go.kr/B551011/KorService2/searchKeyword2?${searchParams}`;
    
    const searchResponse = await fetch(searchUrl);

    if (!searchResponse.ok) {
      throw new Error(`검색 API 오류: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    
    if (searchData.response.header.resultCode !== '0000') {
      throw new Error(`검색 API 오류: ${searchData.response.header.resultMsg}`);
    }

    const items = searchData.response.body.items?.item;
    if (!items || items.length === 0) {
      return null;
    }

    // 가장 정확한 매칭 찾기 (더 유연한 매칭)
    let bestMatch = items.find((item: any) => {
      const title = item.title.toLowerCase();
      const searchName = spotName.toLowerCase();
      
      // 태화루 특별 처리: "탁주"가 포함된 결과 제외
      if (searchName === '태화루' && title.includes('탁주')) {
        return false;
      }
      
      // 정확한 포함 관계 확인
      if (title.includes(searchName) || searchName.includes(title)) {
        return true;
      }
      
      // 괄호 제거 후 비교
      const cleanTitle = title.replace(/\([^)]*\)/g, '').trim();
      const cleanSearchName = searchName.replace(/\([^)]*\)/g, '').trim();
      
      if (cleanTitle.includes(cleanSearchName) || cleanSearchName.includes(cleanTitle)) {
        return true;
      }
      
      // 공백 제거 후 비교
      const noSpaceTitle = title.replace(/\s+/g, '');
      const noSpaceSearchName = searchName.replace(/\s+/g, '');
      
      return noSpaceTitle.includes(noSpaceSearchName) || noSpaceSearchName.includes(noSpaceTitle);
    });

    // 태화루의 경우 "탁주"가 포함되지 않은 결과를 우선적으로 찾기
    if (!bestMatch && spotName === '태화루') {
      bestMatch = items.find((item: any) => {
        const title = item.title.toLowerCase();
        return title.includes('태화루') && !title.includes('탁주');
      });
    }

    // 여전히 찾지 못한 경우 첫 번째 결과 사용
    if (!bestMatch) {
      bestMatch = items[0];
    }

    const contentId = bestMatch.contentid;

    // 상세정보 가져오기
    const detailParams = new URLSearchParams({
      serviceKey: decodeURIComponent(serviceKey),
      pageNo: '1',
      numOfRows: '1',
      MobileOS: 'WEB',
      MobileApp: 'Ulsan',
      _type: 'json',
      contentId
    });

    const detailUrl = `https://apis.data.go.kr/B551011/KorService2/detailCommon2?${detailParams}`;
    const detailResponse = await fetch(detailUrl);

    if (!detailResponse.ok) {
      throw new Error(`상세정보 API 오류: ${detailResponse.status}`);
    }

    const detailData: TourApiDetailResponse = await detailResponse.json();
    
    if (detailData.response.header.resultCode !== '0000') {
      throw new Error(`상세정보 API 오류: ${detailData.response.header.resultMsg}`);
    }

    const detailItem = detailData.response.body.items?.item?.[0];
    if (!detailItem) {
      throw new Error('상세정보를 찾을 수 없습니다.');
    }

    // 소개정보 가져오기
    const introParams = new URLSearchParams({
      serviceKey: decodeURIComponent(serviceKey),
      pageNo: '1',
      numOfRows: '1',
      MobileOS: 'WEB',
      MobileApp: 'Ulsan',
      _type: 'json',
      contentId,
      contentTypeId: detailItem.contenttypeid
    });

    const introUrl = `https://apis.data.go.kr/B551011/KorService2/detailIntro2?${introParams}`;
    const introResponse = await fetch(introUrl);

    let introItem: TourApiIntroItem | null = null;
    if (introResponse.ok) {
      const introData: TourApiIntroResponse = await introResponse.json();
      if (introData.response.header.resultCode === '0000') {
        introItem = introData.response.body.items?.item?.[0] || null;
      }
    }

    // 특정 관광지에 대해 로컬 이미지 사용
    let imageUrl = detailItem.firstimage || detailItem.firstimage2 || '/placeholder-image.jpg';
    
    if (spotName === '복순도가') {
      imageUrl = 복순도가이미지;
    } else if (spotName === '트레비어') {
      imageUrl = 트레비어이미지;
    } else if (spotName === 'Fe01') {
      imageUrl = fe01이미지;
    } else if (spotName === '남창옹기종기시장') {
      imageUrl = 남창옹기종기시장이미지;
    } else if (spotName === '외고산 옹기마을') {
      imageUrl = 외고산옹기마을이미지;
    } else if (spotName === '출렁다리') {
      imageUrl = 대왕암출렁다리이미지;
    } else if (spotName === '일산해수욕장') {
      imageUrl = 일산해수욕장이미지;
    } else if (spotName === '장생포고래문화특구') {
      imageUrl = 장생포고래문화특구이미지;
    } else if (spotName === '울산 문화의거리') {
      imageUrl = 울산문화의거리이미지;
    } else if (spotName === '보성학교전시관') {
      imageUrl = 보성학교전시관이미지;
    }

    return {
      name: detailItem.title,
      contentId: detailItem.contentid,
      lat: parseFloat(detailItem.mapy),
      lng: parseFloat(detailItem.mapx),
      image: imageUrl,
      description: detailItem.overview || '상세 정보가 준비 중입니다.',
      address: `${detailItem.addr1} ${detailItem.addr2 || ''}`.trim(),
      tel: detailItem.tel,
      useTime: introItem?.usetime || introItem?.usetimeculture || undefined,
      restDate: introItem?.restdate || introItem?.restdateculture || undefined,
      parking: introItem?.parking || introItem?.parkingculture || undefined
    };

  } catch (error) {
    console.error(`"${spotName}" 정보 가져오기 실패:`, error);
    return null;
  }
}

// 캐시를 위한 메모리 저장소 (성능 최적화)
const spotInfoCache = new Map<string, CourseSpotInfo>();
const courseCache = new Map<string, CourseSpotInfo[]>();

// 코스별 모든 관광지 정보 가져오기 (병렬 처리로 성능 향상)
export async function getCourseSpotsInfo(courseName: string): Promise<CourseSpotInfo[]> {
  const spotNames = COURSE_SPOT_MAPPING[courseName];
  
  if (!spotNames) {
    console.error(`"${courseName}" 코스 정보를 찾을 수 없습니다.`);
    return [];
  }

  // 병렬로 모든 관광지 정보 가져오기
  const spotPromises = spotNames.map(async (spotName) => {
    // 캐시 확인
    if (spotInfoCache.has(spotName)) {
      return spotInfoCache.get(spotName)!;
    }

    const spotInfo = await searchSpotByName(spotName);
    if (spotInfo) {
      spotInfoCache.set(spotName, spotInfo);
    }
    return spotInfo;
  });

  const results = await Promise.all(spotPromises);
  const validResults = results.filter((spot): spot is CourseSpotInfo => spot !== null);
  return validResults;
}

// 캐시를 사용하는 버전 (코스 단위 캐시 추가)
export async function getCourseSpotsInfoWithCache(courseName: string): Promise<CourseSpotInfo[]> {
  // 코스 단위 캐시 확인
  if (courseCache.has(courseName)) {
    return courseCache.get(courseName)!;
  }

  const spotsInfo = await getCourseSpotsInfo(courseName);
  
  // 코스 단위 캐시 저장
  courseCache.set(courseName, spotsInfo);
  
  return spotsInfo;
}

// 캐시 초기화 함수
export function clearSpotCache() {
  spotInfoCache.clear();
  courseCache.clear();
}

// 첫 번째 관광지만 빠르게 가져오는 함수 (대표 이미지용)
export async function getFirstSpotInfo(courseName: string): Promise<CourseSpotInfo | null> {
  const spotNames = COURSE_SPOT_MAPPING[courseName];
  
  if (!spotNames || spotNames.length === 0) {
    return null;
  }

  const firstSpotName = spotNames[0];
  
  // 캐시 확인
  if (spotInfoCache.has(firstSpotName)) {
    return spotInfoCache.get(firstSpotName)!;
  }

  // 첫 번째 관광지만 가져오기
  const spotInfo = await searchSpotByName(firstSpotName);
  if (spotInfo) {
    spotInfoCache.set(firstSpotName, spotInfo);
  }
  
  return spotInfo;
}

// 관광지 이미지 가져오기
export async function getSpotImages(contentId: string): Promise<SpotImage[]> {
  const serviceKey = import.meta.env.VITE_TOURAPI_KEY;
  
  if (!serviceKey) {
    console.error('Tour API 키가 설정되지 않았습니다.');
    return [];
  }

  try {
    const params = new URLSearchParams({
      serviceKey: decodeURIComponent(serviceKey),
      pageNo: '1',
      numOfRows: '20',
      MobileOS: 'WEB',
      MobileApp: 'Ulsan',
      _type: 'json',
      contentId
    });

    const url = `https://apis.data.go.kr/B551011/KorService2/detailImage2?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`이미지 API 오류: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.response.header.resultCode !== '0000') {
      throw new Error(`이미지 API 오류: ${data.response.header.resultMsg}`);
    }

    const items = data.response.body.items?.item;
    return items || [];
  } catch (error) {
    console.error('관광지 이미지 로드 실패:', error);
    return [];
  }
}

import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Badge } from '@/shared/ui/components/atoms/badge';

const latestNews = [
  { id: 1, category: 'TECHNOLOGY', text: '🚀 새로운 AI 기술이 개발자 생산성을 200% 향상시킵니다' },
  { id: 2, category: 'FINANCE', text: '📈 글로벌 시장, 4분기 실적 호조로 상승세 지속' },
  { id: 3, category: 'SPORTS', text: '⚽ 월드컵 예선, 한국 대표팀 극적인 승리' },
  { id: 4, category: 'CULTURE', text: '🎬 한국 영화, 해외 시상식에서 3관왕 달성' },
  { id: 5, category: 'AUTOMOTIVE', text: '🚗 전기차 시장, 올해 판매량 사상 최대 기록' },
];

const NewsTicker: React.FC = () => (
  <div className="border-t border-b border-gray-200 bg-[#E9ECEF]">
    <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
      <Badge className="shrink-0 bg-blue-600 hover:bg-blue-600">NEW</Badge>
      <Swiper
        modules={[Autoplay]}
        direction="vertical"
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="h-6 flex-1"
      >
        {latestNews.map((news) => (
          <SwiperSlide key={news.id}>
            <a
              href={`#${news.category.toLowerCase()}`}
              className="flex items-center gap-2 truncate text-sm font-medium transition-colors hover:text-blue-600"
            >
              <span className="shrink-0 text-xs font-semibold text-blue-600">[{news.category}]</span>
              <span className="truncate">{news.text}</span>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </div>
);

export default NewsTicker;

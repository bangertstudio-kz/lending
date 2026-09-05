'use client';

import { ImageWithFallback } from './figma/ImageWithFallback';
import cases from '@/app/data/cases.json';

const EDGE_FADE =
  'linear-gradient(to right, transparent 0%, #000 7%, #000 93%, transparent 100%)';

export function WorkMarquee() {
  // Кейсы лежат статичным файлом, а /api/cases просто его отдаёт. Прямой импорт
  // ставит работы в серверный HTML: нет пустой дыры на первом экране и нет
  // лишнего запроса ради того, что и так известно на сборке.
  // Дублируем список: вторая половина въезжает ровно там, где кончается первая.
  const track = [...cases, ...cases];

  return (
    <div
      className="group relative overflow-hidden"
      // Растворение по краям задаём стилем: арбитрарная маска Tailwind
      // с запятыми внутри градиента до CSS не доезжала.
      style={{
        maskImage: EDGE_FADE,
        WebkitMaskImage: EDGE_FADE,
      }}
      aria-hidden
    >
      <ul className="work-marquee flex w-max gap-5 group-hover:[animation-play-state:paused]">
        {track.map((project, index) => (
          <li
            key={`${project.name}-${index}`}
            className="h-[clamp(170px,19vw,250px)] w-[clamp(170px,19vw,250px)] shrink-0 overflow-hidden bg-surface"
          >
            <ImageWithFallback
              src={project.image}
              alt=""
              className="h-full w-full object-cover opacity-80 transition-opacity duration-500 hover:opacity-100"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

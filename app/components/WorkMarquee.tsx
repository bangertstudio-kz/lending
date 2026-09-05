'use client';

import { ImageWithFallback } from './figma/ImageWithFallback';
import cases from '@/app/data/cases.json';

export function WorkMarquee() {
  // Кейсы лежат статичным файлом, а /api/cases просто его отдаёт. Прямой импорт
  // ставит работы в серверный HTML: нет пустой дыры на первом экране и нет
  // лишнего запроса ради того, что и так известно на сборке.
  // Дублируем список: вторая половина въезжает ровно там, где кончается первая.
  const track = [...cases, ...cases];

  return (
    <div
      className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      aria-hidden
    >
      <ul className="work-marquee flex w-max gap-5 group-hover:[animation-play-state:paused]">
        {track.map((project, index) => (
          <li
            key={`${project.name}-${index}`}
            className="h-[clamp(200px,26vw,340px)] w-[clamp(200px,26vw,340px)] shrink-0 overflow-hidden bg-surface"
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

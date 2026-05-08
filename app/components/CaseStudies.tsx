'use client';

import { useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { useTranslation } from 'react-i18next';
import { useCasesStore } from '@/app/store/casesStore';

export function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();
  const { cases, fetch } = useCasesStore();

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <section id="case-studies" ref={sectionRef} className="bg-black py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-white text-center mb-16 text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t('caseStudies.title')}
        </motion.h2>

        <Carousel opts={{ align: 'start', loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {cases.map((project, index) => (
              <CarouselItem key={project.name} className="pl-4 md:basis-1/3">
                <motion.div
                  className="border border-white/10 overflow-hidden hover:border-white/30 transition-colors group h-full"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <a
                    href={project.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block cursor-pointer"
                  >
                    <div className="aspect-square bg-zinc-900 overflow-hidden">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover transition-all duration-500"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white">{project.name}</h3>
                        <span className="text-xs text-white/40 border border-white/20 px-2 py-1">
                          {project.platform}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm mb-4">{project.description}</p>
                    </div>
                  </a>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="flex flex-col md:flex-row items-center md:items-center gap-4 mt-8">
            <div className="flex gap-4">
              <CarouselPrevious className="static translate-y-0 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-30" />
              <CarouselNext className="static translate-y-0 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-30" />
            </div>
            <a
              href="/cases"
              className="text-white/60 text-sm border-b border-white/20 pb-px hover:text-white hover:border-white/60 transition-colors"
            >
              {t('caseStudies.viewAll')} →
            </a>
          </div>
        </Carousel>
      </div>
    </section>
  );
}

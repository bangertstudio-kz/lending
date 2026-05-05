'use client';

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

const projects = [
  {
    name: 'Pings Ai',
    description:
      'Welcome to Pings AI — your personal feed of handpicked insights, ideas, guides, and wisdom powered by AI.',
    platform: 'iOS',
    image: '/assets/case1.png',
    site: 'https://apps.apple.com/kz/app/smart-ideas-daily-pings-ai/id6742242937',
  },
  {
    name: 'QOR',
    description:
      'QOR is a unified ecosystem where private customers, businesses, security agencies, and independent consultants are brought together on a single platform for instant response.',
    platform: 'iOS / Android / Web',
    image: '/assets/case11.png',
    site: 'https://digest.qor.oro.ad',
  },
  {
    name: 'Oro',
    description: 'Oro rents your computing power for AI agents. Fair pricing, transparent billing.',
    platform: 'Web / Kubernetes',
    image: '/assets/case12.png',
    site: 'https://cli.master.oro.ad',
  },
  {
    name: 'Luna Deep',
    description:
      'Luna Deep offers music channels for any moment and mood. We gather the best tracks from around the world to bring you inspiration, energy, and the soundtrack to your life.',
    platform: 'iOS / Android',
    image: '/assets/case2.jpg',
    site: 'https://apps.apple.com/kz/app/luna-deep-prime-music-wave/id6449427218',
  },
  {
    name: 'Equilibrium',
    description: 'Enterprise productivity suite with team collaboration and project management tools',
    platform: 'iOS / Android / Web',
    image: '/assets/case3.jpg',
    site: 'https://apps.apple.com/kz/app/equilibrium-task-emotion/id6754636249',
  },
  {
    name: 'Sapian',
    description:
      'Browse people around you, send a request, and if the interest is mutual, you can start chatting and plan a meeting.',
    platform: 'iOS / Android',
    image: '/assets/case4.png',
    site: 'https://apps.apple.com/kz/app/sapian-walks-talks-nearby/id6756068831',
  },
  {
    name: 'Ocean',
    description:
      'A Cost Per Action (CPA) platform is a service where payment is made only for a specific user action (registration, application, purchase).',
    platform: 'iOS / Android / Web',
    image: '/assets/case5.png',
    site: 'https://www.figma.com/design/1mMrCM6CuUwmYHlFA4kupl/Ocean?node-id=17-25&t=oKPlh9IpLjY0DjWx-1',
  },
  {
    name: 'Toptom',
    description:
      'A B2C/B2B marketplace is a platform where individuals and companies buy and sell goods or services.',
    platform: 'iOS / Android / Web',
    image: '/assets/case6.png',
    site: 'https://www.figma.com/design/qHvGwxdHvEgZryOkKxzi3d/Toptom?node-id=6053-28716&t=LRLKd76Mt7nkUXeN-1',
  },
  {
    name: 'Eiva',
    description: 'Find fitness clubs, sign up for workouts, and purchase gym memberships',
    platform: 'iOS / Android',
    image: '/assets/case8.png',
    site: 'https://apps.apple.com/kz/app/eiva/id6474634288',
  },
  {
    name: 'В гостях у Хив',
    description: 'An exclusive health club',
    platform: 'iOS / Android / Web',
    image: '/assets/case7.png',
    site: 'https://hivclub.ru',
  },
];

export function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

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
            {projects.map((project, index) => (
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
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
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

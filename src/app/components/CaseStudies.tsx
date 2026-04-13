import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import case2Image from '../../assets/case2.jpg';
import case3Image from '../../assets/case3.jpg';
import case4Image from '../../assets/case4.png';
import case5Image from '../../assets/case5.png';
import case6Image from '../../assets/case6.png';
import case7Image from '../../assets/case7.png';
import case1Image from '../../assets/case1.png';
import case8Image from '../../assets/case8.png';
import case9Image from '../../assets/case9.png';
import case10Image from '../../assets/case10.jpg';
import case11Image from '../../assets/case11.png';




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
    description: 'Welcome to Pings AI — your personal feed of handpicked insights, ideas, guides, and wisdom powered by AI.',
    platform: 'iOS',
    image: case1Image,
    site: 'https://apps.apple.com/kz/app/smart-ideas-daily-pings-ai/id6742242937'
  },
  {
    name: 'Luna Deep',
    description: 'Luna Deep offers music channels for any moment and mood. We gather the best tracks from around the world to bring you inspiration, energy, and the soundtrack to your life.',
    platform: 'iOS / Android',
    image: case2Image,
    site: 'https://apps.apple.com/kz/app/luna-deep-prime-music-wave/id6449427218'
  },
  {
    name: 'Equilibrium',
    description: 'Enterprise productivity suite with team collaboration and project management tools',
    platform: 'iOS / Android / Web',
    image: case3Image,
    site: 'https://apps.apple.com/kz/app/equilibrium-task-emotion/id6754636249'
  },
  {
    name: 'Sapian',
    description: 'Browse people around you, send a request, and if the interest is mutual, you can start chatting and plan a meeting.',
    platform: 'iOS / Android',
    image: case4Image,
    site: 'https://apps.apple.com/kz/app/sapian-walks-talks-nearby/id6756068831'
  },
  {
    name: 'Ocean',
    description: 'A Cost Per Action (CPA) platform is a service where payment is made only for a specific user action (registration, application, purchase). Advertisers pay for results, while affiliates or partners earn revenue by driving targeted actions.',
    platform: 'iOS / Android / Web',
    image: case5Image,
    site: 'https://www.figma.com/design/1mMrCM6CuUwmYHlFA4kupl/Ocean?node-id=17-25&t=oKPlh9IpLjY0DjWx-1'
  },
  {
    name: 'Toptom',
    description: 'A B2C/B2B marketplace is a platform where individuals and companies buy and sell goods or services, with prices determined by supply and demand.',
    platform: 'iOS / Android / Web',
    image: case6Image,
    site: 'https://www.figma.com/design/qHvGwxdHvEgZryOkKxzi3d/Toptom?node-id=6053-28716&t=LRLKd76Mt7nkUXeN-1'
  },
  {
    name: 'Eiva',
    description: 'Find fitness clubs, sign up for workouts, and purchase gym memberships',
    platform: 'iOS / Android',
    image: case8Image,
    site: 'https://apps.apple.com/kz/app/eiva/id6474634288'
  },
  {
    name: 'AINA',
    description: 'Almaty\'s most popular shopping centers—right on your phone: discounts, coworking spaces, and everything you need, all in one place',
    platform: 'iOS / Android',
    image: case9Image,
    site: 'https://apps.apple.com/kz/app/aina/id6478210836'
  },
  {
    name: 'Smartdeal',
    description: 'A B2C/B2B marketplace with auctions is a platform where individuals and companies buy and sell through bidding: users place bids, and the price is determined by demand.',
    platform: 'iOS / Android',
    image: case10Image,
    site: 'https://apps.apple.com/kz/app/smartdeal-%D0%B0%D1%83%D0%BA%D1%86%D0%B8%D0%BE%D0%BD-%D0%B7%D0%B0-10%E2%82%B8/id6479311597'
  },
  {
    name: 'В гостях у Хив',
    description: 'An exclusive health club',
    platform: 'iOS / Android / Web',
    image: case7Image,
    site: 'https://hivclub.ru'
  },
  {
    name: 'QOR',
    description: 'QOR is a unified ecosystem where private customers, businesses, security agencies, and independent consultants are brought together on a single platform for instant response.',
    platform: 'iOS / Android / Web',
    image: case11Image,
    site: 'https://digest.qor.oro.ad'
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

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {projects.map((project, index) => (
              <CarouselItem 
                key={project.name}
                className="pl-4 md:basis-1/3"
              >
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
                    <div className="aspect-[9/9] bg-zinc-900 overflow-hidden">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white">
                          {project.name}
                        </h3>
                        <span className="text-xs text-white/40 border border-white/20 px-2 py-1">
                          {project.platform}
                        </span>
                      </div>
                      
                      <p className="text-white/60 text-sm mb-4">
                        {project.description}
                      </p>

                      <div className="space-y-2">
                        { project && project.results && project.results.map((result) => (
                          <div key={result} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-white/40 rounded-full" />
                            <span className="text-white/50 text-sm">{result}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </a>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Кнопки навигации */}
          <div className="flex justify-center md:justify-start gap-4 mt-8">
            <CarouselPrevious 
              className="static translate-y-0 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-30"
            />
            <CarouselNext 
              className="static translate-y-0 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-30"
            />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
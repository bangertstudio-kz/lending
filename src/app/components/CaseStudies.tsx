import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const projects = [
  {
    name: 'FitnessPro',
    description: 'Health & fitness tracking app with social features and AI-powered workout plans',
    platform: 'iOS / Android',
    image: 'https://images.unsplash.com/photo-1707836916010-3c4ad261936c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBzY3JlZW4lMjBtb2NrdXB8ZW58MXx8fHwxNzY2MzkwNDE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    results: ['500K+ downloads', '4.8★ rating', '85% user retention']
  },
  {
    name: 'ShopLocal',
    description: 'E-commerce marketplace connecting local businesses with customers in real-time',
    platform: 'Flutter',
    image: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcGhvbmUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzY2MzkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    results: ['1M+ users', '$10M GMV', '40% growth MoM']
  },
  {
    name: 'TaskMaster',
    description: 'Enterprise productivity suite with team collaboration and project management tools',
    platform: 'iOS / Android / Web',
    image: 'https://images.unsplash.com/photo-1547027072-332f09bd6bb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwdWklMjBkZXNpZ258ZW58MXx8fHwxNzY2MzkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    results: ['250+ companies', '99.9% uptime', 'SOC 2 compliant']
  }
];

export function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={sectionRef} className="bg-black py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Case Studies
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div 
              key={project.name}
              className="border border-white/10 overflow-hidden hover:border-white/30 transition-colors group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              style={{ y: index === 1 ? y : 0 }}
            >
              <div className="aspect-[9/16] bg-zinc-900 overflow-hidden">
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
                  {project.results.map((result) => (
                    <div key={result} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-white/40 rounded-full" />
                      <span className="text-white/50 text-sm">{result}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
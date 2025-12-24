import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

const technologies = [
  { name: 'Flutter', category: 'Framework' },
  { name: 'Swift', category: 'iOS' },
  { name: 'Kotlin', category: 'Android' },
  { name: 'React Native', category: 'Cross-platform' },
  { name: 'Firebase', category: 'Backend' },
  { name: 'REST API', category: 'Integration' },
  { name: 'GraphQL', category: 'Integration' },
  { name: 'CI/CD', category: 'DevOps' },
  { name: 'Git', category: 'Version Control' },
  { name: 'Figma', category: 'Design' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'AWS', category: 'Cloud' }
];

export function Technologies() {
  const { t } = useTranslation();

  return (
    <section id="technologies" className="bg-black py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t('technologies.title')}
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              className="border border-white/10 p-6 text-center hover:border-white/30 transition-colors group"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-white mb-1">
                {tech.name}
              </p>
              <p className="text-white/40 text-xs">
                {tech.category}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
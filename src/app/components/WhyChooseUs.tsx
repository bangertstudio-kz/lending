import { Users, Code, Shield, Zap, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

const reasons = [
  {
    icon: Users,
    title: 'Experienced mobile engineers',
    description: 'Senior developers with 5+ years in mobile development'
  },
  {
    icon: Code,
    title: 'Clean architecture & scalable code',
    description: 'Following industry best practices and design patterns'
  },
  {
    icon: MessageCircle,
    title: 'Transparent communication',
    description: 'Regular updates, daily standups, and clear documentation'
  },
  {
    icon: Zap,
    title: 'Agile development process',
    description: 'Fast iterations, continuous delivery, and adaptive planning'
  },
  {
    icon: Shield,
    title: 'Long-term support',
    description: 'We stay with you beyond launch to ensure success'
  }
];

export function WhyChooseUs() {
  return (
    <section className="bg-zinc-950 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Why Choose Us
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {reasons.map((reason, index) => (
            <motion.div 
              key={reason.title}
              className="flex gap-6"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="flex-shrink-0">
                <reason.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-white mb-2">
                  {reason.title}
                </h3>
                <p className="text-white/60">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
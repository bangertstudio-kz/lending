import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { motion, useScroll, useTransform } from 'motion/react';

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Abstract geometric background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 border border-white/20 rotate-45"
          style={{ y }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 border border-white/20 rounded-full"
          style={{ y: useTransform(scrollY, [0, 500], [0, -100]) }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-48 h-48 border border-white/30"
          style={{ y: useTransform(scrollY, [0, 500], [0, 80]) }}
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <motion.div 
        className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center"
        style={{ opacity, scale }}
      >
        <motion.h1 
          className="text-white mb-6 max-w-4xl mx-auto leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          We Build High-Quality Mobile Applications
        </motion.h1>
        
        <motion.p 
          className="text-white/70 text-xl max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Outsourcing mobile development for startups and businesses worldwide
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-white/90 px-8"
          >
            Get a Free Consultation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 px-8"
          >
            View Our Work
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
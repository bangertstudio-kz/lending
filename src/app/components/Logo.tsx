import { motion, AnimatePresence } from 'motion/react';
import logoImage from '../../assets/image.png';

export function Logo({ handleNavClick }: { handleNavClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void }) {

    return <motion.a
              href="#hero"
              className="flex items-center gap-3"
              onClick={(e) => handleNavClick && handleNavClick(e, '#hero')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={logoImage} alt="Bangert Studio Logo" className="h-10 w-10 object-contain" />
              <span className="text-white text-2xl font-bold tracking-tight">
                Bangert<span className="text-white/60">Studio</span>
              </span>
            </motion.a>

}
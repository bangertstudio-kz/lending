import { Linkedin, Github, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/10 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-white text-xl mb-2">
              MobileForge
            </h3>
            <p className="text-white/50 text-sm">
              Premium mobile app development outsourcing
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <a 
              href="mailto:hello@mobileforge.dev" 
              className="text-white/70 hover:text-white transition-colors"
            >
              hello@mobileforge.dev
            </a>

            <div className="flex gap-4">
              <a 
                href="#" 
                className="text-white/50 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-white/50 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Telegram"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} MobileForge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

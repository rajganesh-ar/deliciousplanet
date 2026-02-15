'use client'

import { motion } from 'framer-motion'

export default function FooterSection() {
  return (
    <footer className="bg-black border-t border-white/10 py-16 px-6">
      <motion.div
        className="max-w-5xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-2xl font-bold text-white mb-4">Built with</h3>
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {['Next.js', 'Payload CMS', 'Tailwind CSS v4', 'Framer Motion', 'GSAP', 'Three.js', 'GLSL Shaders'].map(
            (tech) => (
              <span
                key={tech}
                className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm"
              >
                {tech}
              </span>
            ),
          )}
        </div>
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Delicious. All rights reserved.
        </p>
      </motion.div>
    </footer>
  )
}

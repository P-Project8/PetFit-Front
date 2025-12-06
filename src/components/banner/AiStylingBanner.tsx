import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { ArrowBigRight, ChevronRight } from 'lucide-react';
import type { Variants } from 'framer-motion';
import beforeImg from '/images/onboarding1.png';
import afterImg from '/images/onboarding3.png';

export default function AiStylingBanner() {
  const navigate = useNavigate();

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
  };

  return (
    <section className="px-4 py-8">
      <div onClick={() => navigate('/ai-styling')} className="cursor-pointer">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-linear-to-br from-[#1E3A5F] to-[#24496D]" />
            <div className="pointer-events-none absolute top-0 right-0 w-32 h-32 bg-white/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="pointer-events-none absolute bottom-0 left-0 w-24 h-24 bg-sky-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative z-10 flex items-center justify-between p-6">
            <div className="flex flex-col gap-1 pr-2 shrink">
              <h2 className="text-white text-sm leading-tight whitespace-nowrap">
                이 옷이 어울릴까?
                <br />
                <span className="text-sky-200 text-lg font-bold">
                  미리 입혀보세요
                </span>
              </h2>
              <div className="flex items-center gap-1 mt-3 text-xs text-sky-100/70 group">
                <span>지금 바로 체험하기</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* 이미지 부분만 애니메이션 */}
            <motion.div
              className="flex items-center gap-2 shrink-0 ml-2"
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            >
              <motion.div
                variants={imageVariants}
                className="w-14 h-14 rounded-full overflow-hidden"
              >
                <img
                  src={beforeImg}
                  alt="Before"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.div variants={imageVariants} className="text-white/80">
                <ArrowBigRight className="w-5 h-5" strokeWidth={2.5} />
              </motion.div>

              <motion.div
                variants={imageVariants}
                className="w-18 h-18 rounded-full overflow-hidden shadow-md relative"
              >
                <img
                  src={afterImg}
                  alt="After"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

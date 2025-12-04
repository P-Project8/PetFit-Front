import { motion } from 'framer-motion';

const baseBounce = {
  y: [0, -18, 0], // 통통 튀는 모양
};

const baseTransition = {
  duration: 0.4,
  repeat: Infinity,
  repeatDelay: 1, // 한 번 튄 다음 1초 쉬기
  ease: [0.42, 0, 0.58, 1] as const, // easeInOut 비슷한 곡선
};

export default function LoadingSplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }} // 오버레이 페이드인
    >
      <motion.div
        className="bg-white rounded-2xl py-16 px-8 mx-4 max-w-sm w-full text-center shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }} // 카드 살짝 커지면서 등장
      >
        {/* 로고 파도 애니메이션 */}
        <div className="flex justify-center mb-12 items-end">
          {/* P */}
          <motion.img
            src="/P.png"
            alt="P"
            className="inline-block h-12 mb-1"
            animate={baseBounce}
            transition={{
              ...baseTransition,
              delay: 0, // 제일 먼저
            }}
          />

          {/* et */}
          <motion.span
            className="inline-block font-['KaKamora'] text-4xl mr-0.5 mb-1 text-[#14314F]"
            animate={baseBounce}
            transition={{
              ...baseTransition,
              delay: 0.12, // 살짝 뒤
            }}
          >
            et
          </motion.span>

          {/* F */}
          <motion.img
            src="/F.png"
            alt="F"
            className="inline-block h-12 mb-1"
            animate={baseBounce}
            transition={{
              ...baseTransition,
              delay: 0.24,
            }}
          />

          {/* it */}
          <motion.span
            className="inline-block font-['KaKamora'] text-4xl mb-1 text-[#14314F]"
            animate={baseBounce}
            transition={{
              ...baseTransition,
              delay: 0.36,
            }}
          >
            it
          </motion.span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          AI가 스타일링 중입니다!
        </h2>
        <p className="text-sm text-gray-600">잠시만 기다려주세요</p>
      </motion.div>
    </motion.div>
  );
}

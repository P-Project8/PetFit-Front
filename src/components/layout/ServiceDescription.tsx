import { motion } from 'framer-motion';

export default function ServiceDescription() {
  return (
    <div className="flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl"
      >
        <div className="flex items-center mb-12">
          <img src="/Logo.png" alt="@LOGO" className="w-40" />
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-[#14314F] mb-1">
                AI 스타일링
              </h3>
              <p className="text-gray-500 text-sm">
                사진 한 장으로 완성되는 가상 피팅
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-[#14314F] mb-1">
                엄선된 셀렉션
              </h3>
              <p className="text-gray-500 text-sm">
                반려견을 위한 프리미엄 의류 큐레이션
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-[#14314F] mb-1">
                위시리스트
              </h3>
              <p className="text-gray-500 text-sm">
                마음에 드는 스타일을 모아보세요
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <p className="text-base text-gray-400">
            * 모바일 웹에서 최적화된 경험을 제공합니다
          </p>
        </div>
      </motion.div>
    </div>
  );
}

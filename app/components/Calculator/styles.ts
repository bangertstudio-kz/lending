// Общие классы блоков калькулятора в стиле нового макета.
export const panel = 'flex flex-col gap-5 rounded-[12px] border border-white/40 p-5 lg:p-8';
export const panelTitle = 'text-[24px] leading-8 font-semibold tracking-[-0.02em]';
export const field =
  'w-full rounded-[12px] border border-white/40 bg-transparent px-5 py-4 text-[16px] leading-6 tracking-[-0.02em] text-white ' +
  'placeholder:text-white/40 transition-colors focus:border-lime focus:outline-none';
export const limeButton =
  'flex shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-[40px] bg-lime px-6 py-3 text-[14px] leading-6 font-semibold ' +
  'tracking-[-0.02em] whitespace-nowrap text-ink transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40';

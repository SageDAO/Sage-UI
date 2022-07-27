import { AnimationProps } from 'framer-motion';
const variants: AnimationProps['variants'] = {
  pageInitial: { opacity: 0.5, y: 100 },
  pageAnimate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
    },
  },
  modalInitial: {
    opacity: 1,
    scale: 0.9,
  },
  modalAnimate: {
    opacity: 1,
    scale: 1,
  },
  pageExit: {
    opacity: 1,
    transition: {
      duration: 0.7,
    },
  },
};

export default variants;

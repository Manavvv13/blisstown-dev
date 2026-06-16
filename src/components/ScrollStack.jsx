import { useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>
    <div className="scroll-stack-card-inner" style={{ width: '100%', height: '100%' }}>
      {children}
    </div>
  </div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete
}) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);
  
  // Cache clean untransformed offsets to prevent scroll jitter feedback loops
  const initialOffsetsRef = useRef([]);
  const endElementOffsetRef = useRef(0);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const getScrollData = useCallback(() => {
    const scroller = scrollerRef.current;
    if (useWindowScroll) {
      const winScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const scrollerScroll = scroller ? scroller.scrollTop : 0;
      const rootScroll = document.getElementById('root')?.scrollTop || 0;
      const appScroll = document.querySelector('.app-container')?.scrollTop || 0;
      const mainScroll = document.querySelector('main')?.scrollTop || 0;
      return {
        scrollTop: Math.max(winScroll, scrollerScroll, rootScroll, appScroll, mainScroll),
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement
      };
    } else {
      return {
        scrollTop: scroller ? scroller.scrollTop : 0,
        containerHeight: scroller ? scroller.clientHeight : 0,
        scrollContainer: scroller
      };
    }
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    element => {
      if (useWindowScroll) {
        const rect = element.getBoundingClientRect();
        const winScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const rootScroll = document.getElementById('root')?.scrollTop || 0;
        const appScroll = document.querySelector('.app-container')?.scrollTop || 0;
        const mainScroll = document.querySelector('main')?.scrollTop || 0;
        const currentScroll = Math.max(winScroll, rootScroll, appScroll, mainScroll);
        return rect.top + currentScroll;
      } else {
        return element.offsetTop;
      }
    },
    [useWindowScroll]
  );

  const updateCardTransforms = useCallback((customScrollTop) => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const { scrollTop: measuredScrollTop, containerHeight } = getScrollData();
    const scrollTop = customScrollTop !== undefined ? customScrollTop : measuredScrollTop;
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElementTop = endElementOffsetRef.current || 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = initialOffsetsRef.current[i] || 0;
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const lastCardIndex = cardsRef.current.length - 1;
      const lastCardTop = initialOffsetsRef.current[lastCardIndex] || 0;
      const pinEnd = lastCardTop - stackPositionPx - itemStackDistance * lastCardIndex;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      let opacity = 1;
      if (blurAmount) {
        for (let j = i + 1; j < cardsRef.current.length; j++) {
          const jCardTop = initialOffsetsRef.current[j] || 0;
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          const jTriggerEnd = jCardTop - scaleEndPositionPx;
          const jProgress = calculateProgress(scrollTop, jTriggerStart, jTriggerEnd);
          
          // Reaches full blur and fade effect when scrolled halfway (jProgress = 0.5)
          const effectProgress = Math.min(1, jProgress * 2);
          
          blur += effectProgress * blurAmount;
          opacity *= (1 - effectProgress * 0.95); // fade down to 5% opacity
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
        opacity: Math.round(opacity * 100) / 100
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        lastTransform.translateY !== newTransform.translateY ||
        lastTransform.scale !== newTransform.scale ||
        lastTransform.rotation !== newTransform.rotation ||
        lastTransform.blur !== newTransform.blur ||
        lastTransform.opacity !== newTransform.opacity;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

        // Apply 3D transforms & opacity to outer container
        card.style.transform = transform;
        card.style.webkitTransform = transform;
        card.style.opacity = newTransform.opacity;

        // Apply blur filter to inner wrapper container to avoid WebKit 3D rendering bugs
        const inner = card.querySelector('.scroll-stack-card-inner') || card.firstElementChild;
        if (inner) {
          inner.style.filter = filter;
          inner.style.webkitFilter = filter;
        }

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData
  ]);

  const handleScroll = useCallback((e) => {
    updateCardTransforms(e ? e.scroll : undefined);
  }, [updateCardTransforms]);

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075
      });

      lenis.on('scroll', handleScroll);

      const raf = time => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    } else {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner'),
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        gestureOrientationHandler: true,
        normalizeWheel: true,
        wheelMultiplier: 1,
        touchInertiaMultiplier: 35,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
        touchInertia: 0.6
      });

      lenis.on('scroll', handleScroll);

      const raf = time => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    }
  }, [handleScroll, useWindowScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card')
    );

    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      card.style.transform = 'none';
      card.style.filter = 'none';
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
    });

    initialOffsetsRef.current = cards.map(card => getElementOffset(card));

    cards.forEach((card) => {
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.webkitTransform = 'translateZ(0)';
      card.style.perspective = '1000px';
      card.style.webkitPerspective = '1000px';
    });

    const endElement = useWindowScroll
      ? document.querySelector('.scroll-stack-end')
      : scroller.querySelector('.scroll-stack-end');
    if (endElement) {
      endElementOffsetRef.current = getElementOffset(endElement);
    }

    const handleNativeScroll = () => {
      updateCardTransforms();
    };

    try {
      setupLenis();
    } catch (err) {
      console.warn("Lenis failed to initialize:", err);
    }

    const scrollContainers = [
      window,
      document,
      document.body,
      document.getElementById('root'),
      document.querySelector('.app-container'),
      document.querySelector('main'),
      scroller
    ].filter(Boolean);

    scrollContainers.forEach(el => {
      el.addEventListener('scroll', handleNativeScroll, { passive: true });
    });

    updateCardTransforms();

    const handleResize = () => {
      const currentCards = cardsRef.current;
      if (!currentCards.length) return;

      const cachedTransforms = currentCards.map(card => ({
        transform: card.style.transform,
        filter: card.style.filter
      }));

      currentCards.forEach(card => {
        card.style.transform = 'none';
        card.style.filter = 'none';
      });

      initialOffsetsRef.current = currentCards.map(card => getElementOffset(card));

      const currentEndElement = useWindowScroll
        ? document.querySelector('.scroll-stack-end')
        : scrollerRef.current?.querySelector('.scroll-stack-end');
      if (currentEndElement) {
        endElementOffsetRef.current = getElementOffset(currentEndElement);
      }

      currentCards.forEach((card, i) => {
        if (cachedTransforms[i]) {
          card.style.transform = cachedTransforms[i].transform;
          card.style.filter = cachedTransforms[i].filter;
        }
      });

      updateCardTransforms();
    };

    window.addEventListener('resize', handleResize);

    const t1 = setTimeout(handleResize, 100);
    const t2 = setTimeout(handleResize, 400);
    const t3 = setTimeout(handleResize, 1000);

    return () => {
      window.removeEventListener('resize', handleResize);
      scrollContainers.forEach(el => {
        el.removeEventListener('scroll', handleNativeScroll);
      });
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
      initialOffsetsRef.current = [];
      endElementOffsetRef.current = 0;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    updateCardTransforms,
    getElementOffset
  ]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        {/* Spacer so the last pin can release cleanly */}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;

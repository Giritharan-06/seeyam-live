"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cardPhotoTopic, chooseCardPhoto } from "@/lib/card-photos";

function selectorFor(element: HTMLElement): string {
  const parts: string[] = [];
  let current: Element | null = element;
  while (current && current !== document.body) {
    const parent: Element | null = current.parentElement;
    if (!parent) break;
    const index = Array.prototype.indexOf.call(parent.children, current) + 1;
    parts.unshift(current.tagName.toLowerCase() + ':nth-child(' + index + ')');
    current = parent;
  }
  return 'body > ' + parts.join(' > ');
}

// Render a separate stylesheet; never mutate React-owned card attributes during hydration.
export default function CardArtEnhancer() {
  const pathname = usePathname();
  const [photoStyles, setPhotoStyles] = useState('');
  useEffect(() => {
    let frame = 0;
    const observed = new WeakSet<HTMLElement>();
    const inView = new WeakSet<HTMLElement>();
    const intersection = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        inView.add(entry.target as HTMLElement);
        intersection.unobserve(entry.target);
      });
      schedule();
    }, { rootMargin: '400px' });

    const enhance = () => {
      frame = 0;
      const used = new Map<string, number>();
      const rules: string[] = [];
      document.querySelectorAll<HTMLElement>('[data-card-3d]').forEach(card => {
        const selector = selectorFor(card);
        if (card.closest('[aria-busy="true"]') || card.classList.contains('animate-pulse') || card.querySelector('iframe,video,img:not([src*="logo"]):not([src*="avatar"])')) {
          rules.push(selector + '::before,' + selector + '::after{display:none;}');
          return;
        }
        const headings = [...card.querySelectorAll('h1,h2,h3,h4,h5')].filter(heading => heading.closest('[data-card-3d]') === card);
        const title = headings.map(heading => heading.textContent || '').join(' ') || card.getAttribute('aria-label') || card.textContent?.trim().slice(0, 180) || '';
        const topic = cardPhotoTopic(title, card.getAttribute('data-card-3d') || 'learning');
        const photo = chooseCardPhoto(topic, used);
        const style = getComputedStyle(card);
        const side = style.display.includes('flex') && style.flexDirection.startsWith('row');
        if (!observed.has(card)) { intersection.observe(card); observed.add(card); }
        if (inView.has(card)) rules.push(selector + '::before{background-image:url("' + photo.src + '");}');
        if (side) {
          rules.push(selector + '::before{width:76px;height:64px;margin:0 12px 0 0;align-self:center;border-radius:12px;}');
          rules.push('@media(max-width:767px){' + selector + '::before{width:52px;height:52px;margin-right:8px;}}');
        } else if (card.getAttribute('data-card-density') === 'regular') {
          const top = parseFloat(style.paddingTop) + 24;
          const left = parseFloat(style.paddingLeft) + 24;
          rules.push(selector + '::after{content:"Illustrative photo";top:' + top + 'px;left:' + left + 'px;}');
        }
      });
      setPhotoStyles(rules.join('\n'));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(enhance); };
    schedule();
    const mutations = new MutationObserver(records => {
      if (records.some(record => {
        const element = record.target instanceof Element ? record.target : record.target.parentElement;
        return !element?.closest('style[data-card-photography]');
      })) schedule();
    });
    mutations.observe(document.body, { childList: true, subtree: true, characterData: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => { mutations.disconnect(); intersection.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize', schedule); };
  }, [pathname]);
  return <style data-card-photography>{photoStyles}</style>;
}

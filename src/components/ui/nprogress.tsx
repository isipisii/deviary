'use client';
import NProgress from 'nprogress';
import { useEffect } from 'react';

export interface NextNProgressProps {
    color?: string;
    height?: number;
    initialPosition?: number;
    speed?: number;
    trickleSpeed?: number;
    trickle?: boolean;
    easing?: string;
    template?: string;
    zIndex?: number;
}

/*
  This code is an alternative solution i found provided in the following GitHub issue:
  https://github.com/Skyleen77/next-nprogress-bar/issues/27
  
  Thanks and credits to the respective contributor.
*/

export default function NextNProgress({
    color = 'var(--yellow-500)',
    height = 3,
    initialPosition = 0.08,
    speed = 200,
    trickleSpeed = 200,
    trickle = true,
    easing = 'ease',
    template = '<div class="bar" role="bar"><div class="peg"></div></div>',
    zIndex = 1000,
}: NextNProgressProps) {
    const styles = (
        <style>
            {`#nprogress{pointer-events:none}#nprogress
            .bar{background:${color};position:fixed;z-index:${zIndex};top: 0;left:0;width:100%;height:${height}px}
            #nprogress .peg{display:block;position:absolute;right:0;width:100px;height:100%;opacity:1;-webkit-transform:rotate(3deg) translate(0px,-4px);-ms-transform:rotate(3deg) translate(0px,-4px);transform:rotate(3deg) translate(0px,-4px)}
            .nprogress-custom-parent{overflow:hidden;position:relative}.nprogress-custom-parent #nprogress .bar,.nprogress-custom-parent #nprogress .spinner{position:absolute}@-webkit-keyframes nprogress-spinner{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}@keyframes nprogress-spinner{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}
        </style>
    );

    useEffect(() => {
        NProgress.configure({
            showSpinner: false,
            trickle,
            trickleSpeed,
            minimum: initialPosition,
            easing,
            speed,
            template,
        });

        function isAnchorOfCurrentUrl(currentUrl: string, newUrl: string) {
            const currentUrlObj = new URL(currentUrl);
            const newUrlObj = new URL(newUrl);
            // Compare hostname, pathname, and search parameters
            if (
                currentUrlObj.hostname === newUrlObj.hostname &&
                currentUrlObj.pathname === newUrlObj.pathname &&
                currentUrlObj.search === newUrlObj.search
            ) {
                // Check if the new URL is just an anchor of the current URL page
                const currentHash = currentUrlObj.hash;
                const newHash = newUrlObj.hash;
                return (
                    currentHash !== newHash &&
                    currentUrlObj.href.replace(currentHash, '') === newUrlObj.href.replace(newHash, '')
                );
            }
            return false;
        }

        const htmlElements = document.querySelectorAll('html');

        function findClosestAnchor(element: HTMLElement | null): HTMLAnchorElement | null {
            while (element && element.tagName.toLowerCase() !== 'a') {
                element = element.parentElement;
            }
            return element as HTMLAnchorElement;
        }

       // THIS IS THE FIX
        function findClosestAction(element: HTMLElement | null): HTMLElement | null {
            let loopCount = 0;
            while (element && element.dataset.nprogressAction !== 'true') {
                element = element.parentElement;
                loopCount++;

                if (loopCount > 10) {
                    return null;
                }
            }
            return element as HTMLElement;
        }

        function handleClick(event: MouseEvent) {
            try {
                const target = event.target as HTMLElement;
                const anchor = findClosestAnchor(target);
                const newUrl = anchor?.href;

                const action = findClosestAction(target);
                if (action) {
                    event.preventDefault();
                    return;
                }

                if (newUrl) {
                    const currentUrl = window.location.href;
                    // const newUrl = (anchor as HTMLAnchorElement).href;
                    const isExternalLink = (anchor as HTMLAnchorElement).target === '_blank';
                    const isBlob = newUrl.startsWith('blob:');
                    const isAnchor = isAnchorOfCurrentUrl(currentUrl, newUrl);
                    if (newUrl === currentUrl || isAnchor || isExternalLink || isBlob || event.ctrlKey) {
                        NProgress.start();
                        NProgress.done();
                        [].forEach.call(htmlElements, function (el: Element) {
                            el.classList.remove('nprogress-busy');
                        });
                    } else {
                        NProgress.start();
                        (function (history) {
                            const pushState = history.pushState;
                            history.pushState = function () {
                                NProgress.done();
                                [].forEach.call(htmlElements, function (el: Element) {
                                    el.classList.remove('nprogress-busy');
                                });

                                return pushState.apply(history, arguments as any);
                            };
                        })(window.history);
                    }
                }
            } catch (err) {
                NProgress.start();
                NProgress.done();
            }
        }

        // Add the global click event listener
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return styles;
}
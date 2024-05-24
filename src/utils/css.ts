/**
 * @internal
 */
export const nextFrame = async () => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
});

/**
 * @internal
 */
export const transitionEnd = async (el: Element) => new Promise<void>((resolve) => {
    if (!getComputedStyle(el).transition)
        resolve();

    const done = () => {
        el.removeEventListener("transitionend", done);
        el.removeEventListener("transitioncancel", done);
        resolve();
    };
    
    el.addEventListener("transitionend", done);
    el.addEventListener("transitioncancel", done);
});
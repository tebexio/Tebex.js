/**
 * CSS dimension, measured in pixels or percentages
 */
export type CssDimension = number | `${ number }px` | `${ number }%`;

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
    const style = getComputedStyle(el);

    if (!style.transition)
        resolve();

    if (parseFloat(style.transitionDuration) === 0)
        resolve();

    const done = () => {
        el.removeEventListener("transitionend", done);
        el.removeEventListener("transitioncancel", done);
        resolve();
    };
    
    el.addEventListener("transitionend", done);
    el.addEventListener("transitioncancel", done);
});
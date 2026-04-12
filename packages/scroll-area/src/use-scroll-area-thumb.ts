import * as React from 'react';
import { Platform, type ScrollView } from 'react-native';
import { useScrollAreaContext } from './context';
import { ScrollbarContext } from './scrollbar';
import { useGesture } from './use-gesture';
import type { ScrollAreaThumbState } from './types';

export function useScrollAreaThumb() {
    const context = useScrollAreaContext();
    const scrollbarContext = React.useContext(ScrollbarContext);

    if (!scrollbarContext) {
        throw new Error('ScrollArea.Thumb must be used within a ScrollArea.Scrollbar');
    }

    const { orientation } = scrollbarContext;
    const {
        contentHeight, contentWidth, rawScrollX, rawScrollY, scrollbarHeight, scrollbarWidth,
        scrollX, scrollY, setIsScrolling, viewportHeight, viewportRef, viewportWidth,
    } = context;

    const isHorizontal = orientation === 'horizontal';

    const thumbSize = React.useMemo(() => {
        const scrollbarDim = isHorizontal ? scrollbarWidth : scrollbarHeight;
        const contentDim = isHorizontal ? contentWidth : contentHeight;
        const viewportDim = isHorizontal ? viewportWidth : viewportHeight;

        if (scrollbarDim === 0 || contentDim === 0) return 0;
        return Math.min(Math.max(40, scrollbarDim * (viewportDim / contentDim)), 100);
    }, [isHorizontal, contentWidth, viewportWidth, scrollbarWidth, contentHeight, viewportHeight, scrollbarHeight]);

    const { isDragging, panHandlers } = useGesture({
        contentHeight, contentWidth, orientation, rawScrollX, rawScrollY, scrollbarHeight,
        scrollbarWidth, setIsScrolling, thumbSize, viewportHeight,
        viewportRef: viewportRef as React.RefObject<ScrollView | null>, viewportWidth,
    });

    React.useEffect(() => {
        if (Platform.OS !== 'web' || !isDragging) return;
        const doc = (globalThis as any).document;
        if (!doc?.body) return;

        const originalCursor = doc.body.style.cursor;
        const originalUserSelect = doc.body.style.userSelect;
        doc.body.style.cursor = 'grabbing';
        doc.body.style.userSelect = 'none';

        return () => {
            doc.body.style.cursor = originalCursor;
            doc.body.style.userSelect = originalUserSelect;
        };
    }, [isDragging]);

    const thumbState: ScrollAreaThumbState = React.useMemo(
        () => ({ isDragging, orientation }),
        [orientation, isDragging],
    );

    const transform = React.useMemo(() => {
        if (isHorizontal) {
            const range = contentWidth - viewportWidth;
            return range <= 0 ? [{ translateX: 0 }] : [{ translateX: scrollX.interpolate({ extrapolate: 'clamp', inputRange: [0, range], outputRange: [0, scrollbarWidth - thumbSize] }) }];
        }
        const range = contentHeight - viewportHeight;
        return range <= 0 ? [{ translateY: 0 }] : [{ translateY: scrollY.interpolate({ extrapolate: 'clamp', inputRange: [0, range], outputRange: [0, scrollbarHeight - thumbSize] }) }];
    }, [isHorizontal, contentWidth, viewportWidth, scrollbarWidth, thumbSize, contentHeight, viewportHeight, scrollbarHeight, scrollX, scrollY]);

    return { thumbState, thumbSize, transform, panHandlers, isDragging, isHorizontal };
}
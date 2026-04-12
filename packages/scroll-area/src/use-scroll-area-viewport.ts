import * as React from 'react';
import { Animated, Platform, type LayoutChangeEvent } from 'react-native';
import { useScrollAreaContext } from './context';
import type { ScrollAreaViewportProps } from './types';

export function useScrollAreaViewport(props: ScrollAreaViewportProps) {
    const { measure = true, horizontal = false, onLayout } = props;

    const {
        scrollX, scrollY, setIsScrolling, setViewportHeight, setViewportWidth,
        state, viewportRef, onBlur, onFocus
    } = useScrollAreaContext();

    const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
        if (measure) {
            const { height, width } = event.nativeEvent.layout;
            setViewportWidth(width);
            setViewportHeight(height);
        }
    }, [measure, onLayout, setViewportHeight, setViewportWidth]);

    const handleScroll = React.useMemo(() => Animated.event(
        [{ nativeEvent: { contentOffset: Platform.OS === 'web' ? { x: scrollX, y: scrollY } : horizontal ? { x: scrollX } : { y: scrollY } } }],
        { listener: () => setIsScrolling(true), useNativeDriver: Platform.OS !== 'web' },
    ), [horizontal, scrollX, scrollY, setIsScrolling]);

    return {
        state,
        viewportRef,

        measure,
        handleLayout,
        handleScroll,
        handleScrollBegin: () => setIsScrolling(true),
        handleBlur: onBlur,
        handleFocus: onFocus
    };
}
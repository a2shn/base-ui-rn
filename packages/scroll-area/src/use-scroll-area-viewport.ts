import { useKeyboard } from '@base-ui-rn/core';
import * as React from 'react';
import { Animated, Platform, type LayoutChangeEvent } from 'react-native';
import { useScrollAreaContext } from './context';
import type { ScrollAreaViewportProps } from './types';

export function useScrollAreaViewport(props: ScrollAreaViewportProps) {
    const { measure = true, horizontal = false, onLayout } = props;
    const {
        contentHeight,
        contentWidth,
        hasOverflowX,
        hasOverflowY,
        isFocusable,
        keyboardPageStep,
        keyboardStep,
        rawScrollX,
        rawScrollY,
        scrollX,
        scrollY,
        setIsScrolling,
        setViewportHeight,
        setViewportWidth,
        state,
        tabIndex,
        viewportHeight,
        viewportRef,
        viewportWidth,
    } = useScrollAreaContext();

    const handleLayout = React.useCallback(
        (event: LayoutChangeEvent) => {
            if (measure) {
                const { height, width } = event.nativeEvent.layout;
                setViewportWidth(width);
                setViewportHeight(height);
            }
            onLayout?.(event);
        },
        [measure, onLayout, setViewportHeight, setViewportWidth],
    );

    // Always track both axes so custom scrollbars work in both orientations
    const handleScroll = React.useMemo(
        () =>
            Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX, y: scrollY } } }],
                { listener: () => setIsScrolling(true), useNativeDriver: false },
            ),
        [scrollX, scrollY, setIsScrolling],
    );

    // Always call the hook (Rules of Hooks).
    // On native, arrow/page keys move accessibility focus — they don't scroll,
    // so we only wire this up on web.
    const webKeyHandler = useKeyboard({
        onArrowDown: () =>
            viewportRef.current?.scrollTo({
                animated: true,
                x: rawScrollX.current,
                y: rawScrollY.current + keyboardStep,
            }),
        onArrowLeft: () =>
            viewportRef.current?.scrollTo({
                animated: true,
                x: rawScrollX.current - keyboardStep,
                y: rawScrollY.current,
            }),
        onArrowRight: () =>
            viewportRef.current?.scrollTo({
                animated: true,
                x: rawScrollX.current + keyboardStep,
                y: rawScrollY.current,
            }),
        onArrowUp: () =>
            viewportRef.current?.scrollTo({
                animated: true,
                x: rawScrollX.current,
                y: rawScrollY.current - keyboardStep,
            }),
        onEnd: () =>
            viewportRef.current?.scrollTo({
                animated: true,
                x: hasOverflowX ? contentWidth - viewportWidth : rawScrollX.current,
                y: hasOverflowY ? contentHeight - viewportHeight : rawScrollY.current,
            }),
        onHome: () =>
            viewportRef.current?.scrollTo({
                animated: true,
                x: hasOverflowX ? 0 : rawScrollX.current,
                y: hasOverflowY ? 0 : rawScrollY.current,
            }),
        onPageDown: () =>
            viewportRef.current?.scrollTo({
                animated: true,
                x: hasOverflowX
                    ? rawScrollX.current + viewportWidth * keyboardPageStep
                    : rawScrollX.current,
                y: hasOverflowY
                    ? rawScrollY.current + viewportHeight * keyboardPageStep
                    : rawScrollY.current,
            }),
        onPageUp: () =>
            viewportRef.current?.scrollTo({
                animated: true,
                x: hasOverflowX
                    ? rawScrollX.current - viewportWidth * keyboardPageStep
                    : rawScrollX.current,
                y: hasOverflowY
                    ? rawScrollY.current - viewportHeight * keyboardPageStep
                    : rawScrollY.current,
            }),
    });

    return {
        state,
        viewportRef,
        measure,
        handleLayout,
        handleScroll,
        handleScrollBegin: () => setIsScrolling(true),
        // Viewport is the tab stop — it owns focus position and keyboard scrolling.
        // onFocus/onBlur are NOT here; Root captures them via event bubbling instead,
        // which is what drives state.focused and the native focus ring overlay.
        isFocusable,
        tabIndex,
        handleKeyDown: Platform.OS === 'web' ? webKeyHandler : undefined,
    };
}
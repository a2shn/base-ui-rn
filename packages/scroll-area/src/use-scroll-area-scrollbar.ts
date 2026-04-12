import * as React from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useScrollAreaContext } from './context';
import type { ScrollAreaScrollbarProps, ScrollAreaScrollbarState } from './types';

export function useScrollAreaScrollbar(props: ScrollAreaScrollbarProps) {
    const { keepMounted = false, orientation = 'vertical', onLayout } = props;
    const { setScrollbarHeight, setScrollbarWidth, state } = useScrollAreaContext();

    const scrollbarState: ScrollAreaScrollbarState = React.useMemo(
        () => ({ ...state, orientation }),
        [state, orientation],
    );

    const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
        const { height, width } = event.nativeEvent.layout;
        if (orientation === 'horizontal') setScrollbarWidth(width);
        else setScrollbarHeight(height);
    }, [onLayout, orientation, setScrollbarHeight, setScrollbarWidth]);

    const hasOverflow = orientation === 'horizontal' ? state.hasOverflowX : state.hasOverflowY;
    const isVisible = keepMounted || (hasOverflow && state.isVisible);

    return { scrollbarState, handleLayout, isVisible, orientation };
}
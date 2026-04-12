import * as React from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useScrollAreaContext } from './context';
import type { ScrollAreaContentProps } from './types';

export function useScrollAreaContent(props: ScrollAreaContentProps) {
    const { onLayout } = props;
    const { setContentHeight, setContentWidth } = useScrollAreaContext();

    const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
        const { height, width } = event.nativeEvent.layout;
        setContentWidth(width);
        setContentHeight(height);
    }, [onLayout, setContentHeight, setContentWidth]);

    return { handleLayout };
}
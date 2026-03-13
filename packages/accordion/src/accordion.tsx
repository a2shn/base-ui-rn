import * as React from 'react';
import { View } from 'react-native';
import { AccordionContext } from './context';
import type { AccordionRootProps } from './types';
import { useAccordionRoot } from './use-accordion';

export const AccordionRoot = React.forwardRef<View, AccordionRootProps>(
  (props, ref) => {
    const {
      children,
      style,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      'data-orientation': dataOrientation,
      'data-disabled': dataDisabled,
      ...otherProps
    } = props;

    const {
      baseId,
      orientation,
      disabled,
      multiple,
      openItems,
      registerItem,
      toggleItem,
      getItemIndex,
      getItemRef,
      state,
    } = useAccordionRoot(props);

    const contextValue = React.useMemo(
      () => ({
        baseId,
        orientation,
        disabled,
        multiple,
        openItems,
        registerItem,
        toggleItem,
        getItemIndex,
        getItemRef,
      }),
      [
        baseId,
        orientation,
        disabled,
        multiple,
        openItems,
        registerItem,
        toggleItem,
        getItemIndex,
        getItemRef,
      ],
    );

    const resolvedStyle = typeof style === 'function' ? style(state) : style;
    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;

    return (
      <React.Fragment>
        <AccordionContext.Provider value={contextValue}>
          <View
            {...otherProps}
            ref={ref}
            style={resolvedStyle}
            role='group'
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-details={ariaDetails}
            aria-expanded={ariaExpanded}
            aria-busy={ariaBusy}
            aria-hidden={ariaHidden}
            data-orientation={dataOrientation ?? orientation}
            data-disabled={dataDisabled ?? (disabled ? 'true' : undefined)}
          >
            {resolvedChildren}
          </View>
        </AccordionContext.Provider>
      </React.Fragment>
    );
  },
);

AccordionRoot.displayName = 'AccordionRoot';

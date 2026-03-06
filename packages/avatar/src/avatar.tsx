import * as React from 'react';
import {
	View,
	Image as RNImage,
	type ImageProps as RNImageProps,
} from 'react-native';
import type {
	AvatarRootProps,
	AvatarImageProps,
	AvatarFallbackProps,
	ImageLoadingStatus,
} from './types';
import { AvatarContext, useAvatarContext } from './avatar-context';

/**
 * Headless avatar primitive for React Native.
 *
 * @example
 * ```tsx
 * <Avatar.Root>
 *   <Avatar.Image source={{ uri: 'https://github.com/shadcn.png' }} />
 *   <Avatar.Fallback delay={600}>
 *     <Text>JD</Text>
 *   </Avatar.Fallback>
 * </Avatar.Root>
 * ```
 */
export const AvatarRoot = React.forwardRef<View, AvatarRootProps>(
	(props, ref) => {
		const { children, accessible, accessibilityRole, ...other } = props;
		const [loadingStatus, setLoadingStatus] =
			React.useState<ImageLoadingStatus>('idle');

		const onLoadingStatusChange = React.useCallback(
			(status: ImageLoadingStatus) => {
				setLoadingStatus(status);
			},
			[],
		);

		const contextValue = React.useMemo(
			() => ({
				loadingStatus,
				onLoadingStatusChange,
			}),
			[loadingStatus, onLoadingStatusChange],
		);

		const isLoading = loadingStatus === 'loading';

		return (
			<AvatarContext.Provider value={contextValue}>
				<View
					{...other}
					ref={ref}
					accessible={accessible !== false}
					accessibilityRole={accessibilityRole ?? 'image'}
					aria-busy={isLoading}
				>
					{children}
				</View>
			</AvatarContext.Provider>
		);
	},
);

AvatarRoot.displayName = 'Avatar.Root';

/**
 * The image component for the avatar.
 *
 * Automatically manages loading status within the Avatar.Root context.
 */
export const AvatarImage = React.forwardRef<RNImage, AvatarImageProps>(
	(props, ref) => {
		const {
			onLoadingStatusChange: onLoadingStatusChangeProp,
			source,
			accessible = false,
			...other
		} = props;
		const { onLoadingStatusChange } = useAvatarContext();

		const sourceKey = React.useMemo(() => {
			if (typeof source === 'number') {
				return `asset:${source}`;
			}

			if (Array.isArray(source)) {
				return source.map((item) => item?.uri ?? '').join('|');
			}

			if (source && typeof source === 'object' && 'uri' in source) {
				return source.uri ?? '';
			}

			return '';
		}, [source]);

		const lastStableStatusRef = React.useRef<ImageLoadingStatus>('idle');
		const lastSourceKeyRef = React.useRef(sourceKey);

		if (lastSourceKeyRef.current !== sourceKey) {
			lastSourceKeyRef.current = sourceKey;
			lastStableStatusRef.current = 'idle';
		}

		const handleLoadingStatusChange = React.useCallback(
			(status: ImageLoadingStatus) => {
				if (
					status === 'loading' &&
					(lastStableStatusRef.current === 'loaded' ||
						lastStableStatusRef.current === 'error')
				) {
					return false;
				}

				lastStableStatusRef.current = status;
				onLoadingStatusChange(status);
				onLoadingStatusChangeProp?.(status);
				return true;
			},
			[onLoadingStatusChange, onLoadingStatusChangeProp],
		);

		const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
		const clearLoadTimeout = React.useCallback(() => {
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current as ReturnType<typeof setTimeout>);
				timeoutRef.current = null;
			}
		}, []);

		const handleLoadStart = React.useCallback((e?: unknown) => {
			const didApplyLoading = handleLoadingStatusChange('loading');
			clearLoadTimeout();
			if (didApplyLoading) {
				timeoutRef.current = setTimeout(() => {
					handleLoadingStatusChange('error');
				}, 10000);
			}
			(other as any).onLoadStart?.(e);
		}, [handleLoadingStatusChange, clearLoadTimeout, other]);

		const handleLoad = React.useCallback((e?: unknown) => {
			clearLoadTimeout();
			handleLoadingStatusChange('loaded');
			(other as any).onLoad?.(e);
		}, [clearLoadTimeout, handleLoadingStatusChange, other]);

		const handleError = React.useCallback((e?: unknown) => {
			clearLoadTimeout();
			handleLoadingStatusChange('error');
			(other as any).onError?.(e);
		}, [clearLoadTimeout, handleLoadingStatusChange, other]);

		React.useEffect(() => {
			if (!source) {
				handleLoadingStatusChange('error');
			}
			return () => {
				clearLoadTimeout();
			};
		}, [source, handleLoadingStatusChange, clearLoadTimeout]);

		return (
			<RNImage
				{...(other as RNImageProps)}
				ref={ref}
				source={source}
				accessible={accessible}
				onLoadStart={handleLoadStart}
				onLoad={handleLoad}
				onError={handleError}
			/>
		);
	},
);

AvatarImage.displayName = 'Avatar.Image';

/**
 * A fallback component rendered when the image is loading or fails to load.
 */
export const AvatarFallback = React.forwardRef<View, AvatarFallbackProps>(
	(props, ref) => {
		const { delay, children, accessible = true, ...other } = props;
		const { loadingStatus } = useAvatarContext();
		const [canRender, setCanRender] = React.useState(delay === undefined);

		React.useEffect(() => {
			if (delay !== undefined) {
				const timer = setTimeout(() => setCanRender(true), delay);
				return () => clearTimeout(timer);
			}
			return undefined;
		}, [delay]);

		if (canRender && loadingStatus !== 'loaded') {
			return (
				<View
					{...other}
					ref={ref}
					accessible={accessible}
					importantForAccessibility='yes'
				>
					{children}
				</View>
			);
		}

		return null;
	},
);

AvatarFallback.displayName = 'Avatar.Fallback';

export const Avatar = {
	Root: AvatarRoot,
	Image: AvatarImage,
	Fallback: AvatarFallback,
};

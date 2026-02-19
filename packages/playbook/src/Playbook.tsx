import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  StatusBar,
  ScrollView,
  Animated,
  TextInput,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStyles } from './styles';
import {
  getIconForComponent,
  SearchIcon,
  CloseIcon,
  BackIcon,
  ChevronRightIcon,
} from './icons';

export interface PlaybookConfig {
  [key: string]: {
    title: string;
    component: React.ComponentType;
    testID: string;
    description?: string;
    category?: string;
  };
}

interface MenuCardProps {
  title: string;
  description?: string;
  testID: string;
  onPress: () => void;
}

const MenuCard = ({ title, description, testID, onPress }: MenuCardProps) => {
  const styles = useStyles();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = React.useState(false);

  const Icon = getIconForComponent(title);
  const iconColor = '#0071E3';

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      accessibilityRole='button'
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={testID}
    >
      <Animated.View
        style={[
          styles.menuCard,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
          isPressed && styles.menuCardPressed,
        ]}
      >
        <View style={styles.menuCardIconContainer}>
          <View style={styles.menuCardIconBg}>
            <Icon size={28} color={iconColor} />
          </View>
        </View>
        <View style={styles.menuCardContent}>
          <Text style={styles.menuCardText}>{title}</Text>
          {description && (
            <Text style={styles.menuCardDescription}>{description}</Text>
          )}
        </View>
        <View style={styles.menuCardArrow}>
          <ChevronRightIcon size={24} color='#0071E3' />
        </View>
      </Animated.View>
    </Pressable>
  );
};

export const PlaybookApp = ({ registry }: { registry: PlaybookConfig }) => {
  const [screen, setScreen] = React.useState<string | 'Home'>('Home');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const insets = useSafeAreaInsets();
  const styles = useStyles();

  const isHome = screen === 'Home';
  const ActiveComponent = !isHome ? registry[screen].component : null;

  // Filter and sort components based on search query
  const filteredComponents = React.useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    let components = Object.entries(registry);

    if (query) {
      components = components.filter(([, config]) => {
        const titleMatch = config.title.toLowerCase().includes(query);
        const descriptionMatch = config.description
          ?.toLowerCase()
          .includes(query);
        const categoryMatch = config.category?.toLowerCase().includes(query);

        return titleMatch || descriptionMatch || categoryMatch;
      });
    }

    // Sort alphabetically by title
    return components.sort(([, a], [, b]) => a.title.localeCompare(b.title));
  }, [registry, searchQuery]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 10),
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar barStyle='dark-content' />

      {!isHome && (
        <Pressable
          accessibilityRole='button'
          onPress={() => setScreen('Home')}
          style={styles.backButton}
          testID='back-button'
        >
          <View style={styles.backButtonContent}>
            <BackIcon size={20} color='#0071E3' />
            <Text style={styles.backButtonText}>Back to Menu</Text>
          </View>
        </Pressable>
      )}

      {isHome ? (
        <ScrollView
          contentContainerStyle={styles.menuList}
          keyboardShouldPersistTaps='handled'
          onScrollBeginDrag={() => Keyboard.dismiss()}
        >
          <View style={styles.menuHeaderContainer}>
            <Text style={styles.menuHeader}>Base UI RN</Text>
            <Text style={styles.menuSubheader}>
              Component Playbook • {Object.keys(registry).length} Components
            </Text>
          </View>

          <View
            style={[
              styles.searchContainer,
              isSearchFocused && styles.searchContainerFocused,
            ]}
          >
            <View style={styles.searchIconContainer}>
              <SearchIcon size={20} color='#9898A0' />
            </View>
            <TextInput
              accessibilityLabel='Text input field'
              accessibilityHint='Filters the components list as you type'
              style={styles.searchInput}
              placeholder='Search components...'
              placeholderTextColor='#9898A0'
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              autoCapitalize='none'
              autoCorrect={false}
              testID='search-input'
            />
            {searchQuery.length > 0 && (
              <Pressable
                accessibilityRole='button'
                onPress={() => setSearchQuery('')}
                style={styles.searchClearButton}
                testID='search-clear'
              >
                <CloseIcon size={18} color='#9898A0' />
              </Pressable>
            )}
          </View>

          {filteredComponents.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIconContainer}>
                <SearchIcon size={64} color='#E0E0E5' />
              </View>
              <Text style={styles.emptyStateText}>No components found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try a different search term
              </Text>
            </View>
          ) : (
            <View style={styles.componentList}>
              {searchQuery && (
                <Text style={styles.searchResultsText}>
                  {filteredComponents.length} result
                  {filteredComponents.length !== 1 ? 's' : ''}
                </Text>
              )}
              {filteredComponents.map(([key, config]) => (
                <MenuCard
                  key={key}
                  title={config.title}
                  description={config.description}
                  testID={config.testID}
                  onPress={() => setScreen(key)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      ) : (
        ActiveComponent && <ActiveComponent />
      )}
    </View>
  );
};

import { Button } from '@base-ui-rn/button';
import * as React from 'react';
import {
  Keyboard,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackIcon, CloseIcon, getIconForComponent, SearchIcon } from './icons';
import { useStyles } from './styles';

/**
 * Configuration for the Playbook app.
 *
 * @example
 * ```ts
 * const registry: PlaybookConfig = {
 *   Button: {
 *     title: 'Button',
 *     component: ButtonPlayground,
 *     testID: 'button-playground',
 *   },
 * };
 * ```
 */
export interface PlaybookConfig {
  [key: string]: {
    title: string;
    component: React.ComponentType;
    testID: string;
    description?: string;
    category?: string;
  };
}

/**
 * Main Playbook application component.
 *
 * Renders a searchable list of components and allows navigation
 * to individual component playgrounds.
 */
export const PlaybookApp = ({ registry }: { registry: PlaybookConfig }) => {
  const [screen, setScreen] = React.useState<string | 'Home'>('Home');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const insets = useSafeAreaInsets();
  const styles = useStyles();

  const isHome = screen === 'Home';
  const ActiveComponent = !isHome ? registry[screen].component : null;

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

    return components.sort(([, a], [, b]) => a.title.localeCompare(b.title));
  }, [registry, searchQuery]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          paddingTop: Math.max(insets.top, 10),
        },
      ]}
    >
      <StatusBar barStyle='light-content' />

      {!isHome && (
        <Button
          onPress={() => setScreen('Home')}
          style={styles.backButton}
          testID='back-button'
        >
          <View style={styles.backButtonContent}>
            <BackIcon color={styles.backButtonText.color} size={20} />
            <Text style={styles.backButtonText}>Back to Menu</Text>
          </View>
        </Button>
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
              <SearchIcon color={styles.searchInput.color} size={20} />
            </View>
            <TextInput
              accessibilityHint='Filters the components list as you type'
              accessibilityLabel='Text input field'
              autoCapitalize='none'
              autoCorrect={false}
              onBlur={() => setIsSearchFocused(false)}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              placeholder='Search components...'
              placeholderTextColor={styles.emptyStateSubtext.color}
              style={styles.searchInput}
              testID='search-input'
              value={searchQuery}
            />
            {searchQuery.length > 0 && (
              <Button
                onPress={() => setSearchQuery('')}
                role='button'
                style={styles.searchClearButton}
                testID='search-clear'
              >
                <CloseIcon color={styles.searchInput.color} size={18} />
              </Button>
            )}
          </View>

          {filteredComponents.length === 0 ? (
            <View style={styles.emptyState}>
              <View>
                <SearchIcon color={styles.emptyStateText.color} size={64} />
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
              {filteredComponents.map(([key, config]) => {
                const Icon = getIconForComponent(config.title);
                return (
                  <Button
                    key={key}
                    onPress={() => setScreen(key)}
                    style={styles.componentButton}
                    testID={config.testID}
                  >
                    {() => (
                      <View style={styles.componentButtonInner}>
                        <View style={styles.componentButtonIcon}>
                          <Icon
                            color={styles.componentButtonTitle.color}
                            size={24}
                          />
                        </View>
                        <View style={styles.componentButtonContent}>
                          <Text style={styles.componentButtonTitle}>
                            {config.title}
                          </Text>
                          {config.description && (
                            <Text style={styles.componentButtonDescription}>
                              {config.description}
                            </Text>
                          )}
                        </View>
                      </View>
                    )}
                  </Button>
                );
              })}
            </View>
          )}
        </ScrollView>
      ) : (
        ActiveComponent && <ActiveComponent />
      )}
    </View>
  );
};

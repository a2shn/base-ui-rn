import * as React from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@base-ui-rn/button';
import { useStyles } from './styles';
import { getIconForComponent, SearchIcon, CloseIcon, BackIcon } from './icons';

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
          paddingTop: Math.max(insets.top, 10),
          paddingBottom: insets.bottom,
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
            <BackIcon size={20} color={styles.backButtonText.color} />
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
              <SearchIcon size={20} color={styles.searchInput.color} />
            </View>
            <TextInput
              accessibilityLabel='Text input field'
              accessibilityHint='Filters the components list as you type'
              style={styles.searchInput}
              placeholder='Search components...'
              placeholderTextColor={styles.emptyStateSubtext.color}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              autoCapitalize='none'
              autoCorrect={false}
              testID='search-input'
            />
            {searchQuery.length > 0 && (
              <Button
                role='button'
                onPress={() => setSearchQuery('')}
                style={styles.searchClearButton}
                testID='search-clear'
              >
                <CloseIcon size={18} color={styles.searchInput.color} />
              </Button>
            )}
          </View>

          {filteredComponents.length === 0 ? (
            <View style={styles.emptyState}>
              <View>
                <SearchIcon size={64} color={styles.emptyStateText.color} />
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
                    testID={config.testID}
                    style={styles.componentButton}
                  >
                    {() => (
                      <View style={styles.componentButtonInner}>
                        <View style={styles.componentButtonIcon}>
                          <Icon
                            size={24}
                            color={styles.componentButtonTitle.color}
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

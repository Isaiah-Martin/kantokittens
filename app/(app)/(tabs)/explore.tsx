import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  // Define the main color to reuse easily
  const mainBackgroundColor = '#F3A78F';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: mainBackgroundColor, dark: '#4A3728' }}
      // This styles the ScrollView wrapper itself
      style={{ backgroundColor: mainBackgroundColor }}
      // This styles the internal content container within ParallaxScrollView
      contentContainerStyle={{ backgroundColor: mainBackgroundColor }}
      headerImage={
        <IconSymbol
          size={310}
          color="#4A3728"
          name="figure.yoga.circle.fill"
          style={styles.headerImage}
        />
      }>
      {/* The content area starts here. All immediate children ThemedViews need the color applied if they aren't transparent by default. */}

      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Explore
        </ThemedText>
      </ThemedView>
    <ThemedText>Discover Kanto Kittens — a cozy Upper East Side cat cafe where quiet luxury meets adoptable rescue cats and Filipino-inspired treats.</ThemedText>
     <Collapsible title="Visit & Book" backgroundColor={mainBackgroundColor}>
      <ThemedText> Reserve a timed lounge visit for $22 and enjoy an unhurried hour with adoptable cats in curated sensory zones; perfect for locals, tourists, and wellness seekers.
      </ThemedText>
      </Collapsible>
      <Collapsible title="Menu Highlights" backgroundColor={mainBackgroundColor}>
          <ThemedText> Savor Filipino-inspired pastries, specialty coffee, and wellness-forward beverages priced from $8 to $25, crafted to pair with a relaxed cat lounge experience.
            </ThemedText>
      </Collapsible>
      <Collapsible title="Adopt & Give Back" backgroundColor={mainBackgroundColor}>
            <ThemedText> Meet rotating rescue cats available for adoption through our shelter partners; Kanto Kittens emphasizes high adoption success and support for cats at risk.
            </ThemedText>
        </Collapsible>
        <Collapsible title="Events & Private Experiences" backgroundColor={mainBackgroundColor}>
            <ThemedText> Join cat yoga Sundays, movie nights midweek, and curated seasonal events for unique community experiences. </ThemedText>
        </Collapsible>
        <Collapsible title="Why Kanto Kittens" backgroundColor={mainBackgroundColor}>
          <ThemedText> Coquette interiors, trained staff in feline care, and a mission-driven model: make every visit a sanctuary and chance to change a cat’s life.
            </ThemedText>
       </Collapsible>

       {/* Added ThemedView spacer to fill the gap before navigation tabs */}
       <ThemedView style={styles.bottomSpacer} />

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  // Removed unused Collapsible style rule
  titleContainer: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#F3A78F' // Ensure title container matches
  },
  bottomSpacer: {
    // This provides enough height to push the content up past the tab bar area
    height: 50,
    backgroundColor: '#F3A78F', // Explicitly use the color
    // Added margin top to ensure the space after the last collapsible is filled
    marginTop: 10,
  },
});

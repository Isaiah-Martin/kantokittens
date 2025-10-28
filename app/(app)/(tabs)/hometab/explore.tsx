import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#e7c8f7', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="figure.yoga.circle.fill"
          style={styles.headerImage}
        />
      }>
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
     <Collapsible title="Visit & Book"> 
      <ThemedText> Reserve a timed lounge visit for $22 and enjoy an unhurried hour with adoptable cats in curated sensory zones; perfect for locals, tourists, and wellness seekers. 
      </ThemedText> 
      <ThemedText> Fast booking, timed entry, and optional add-ons like a souvenir photo strip make visits simple and shareable. 
        </ThemedText> 
      </Collapsible> 
      <Collapsible title="Menu Highlights"> 
          <ThemedText> Savor Filipino-inspired pastries, specialty coffee, and wellness-forward beverages priced from $8 to $25, crafted to pair with a relaxed cat lounge experience. 
            </ThemedText> 
            <ThemedText> Seasonal specials and themed drinks available during events and private experiences. 
            </ThemedText> 
      </Collapsible> 
      <Collapsible title="Adopt & Give Back"> 
            <ThemedText> Meet rotating rescue cats available for adoption through our shelter partners; Kanto Kittens emphasizes high adoption success and support for cats at risk. 
            </ThemedText> 
            <ThemedText> Merchandise profits support the Kitten Medical Fund and local shelters; shop branded apparel, toys, and artisan home goods from $5 to $65. 
              </ThemedText> 
        </Collapsible> 
        <Collapsible title="Events & Private Experiences"> 
            <ThemedText> Join cat yoga Sundays, movie nights midweek, and curated seasonal events for unique community experiences. </ThemedText>
            <ThemedText> Book private parties and celebrations that include a photo booth, kitty treats, and food discounts with an 18% service gratuity for private bookings. 
              </ThemedText> 
        </Collapsible>
        <Collapsible title="Why Kanto Kittens"> 
          <ThemedText> Soft, coquette interiors, trained staff in feline care and emotional attunement, and a mission-driven model make every visit feel like a sanctuary and a chance to change a cat’s life.
            </ThemedText> 
            <ThemedText type="link">Reserve your visit and learn about upcoming events</ThemedText>
       </Collapsible>
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
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

import { Icon } from "@/components/shared/Icon";
import { Theme } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

export default function Scanner() {
  return (
    <View style={styles.container}>
      <Icon name="barcode" size={64} color={Theme.primary} />
      <Text style={styles.text}>
        Dette er hvor strekkodeskanningen kommer til å dukke opp etter hvert
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.lg,
    padding: Theme.spacing.xl,
    backgroundColor: Theme.background,
  },
  text: {
    fontSize: Theme.fontSize.lg,
    textAlign: "center",
    color: Theme.text,
  },
});

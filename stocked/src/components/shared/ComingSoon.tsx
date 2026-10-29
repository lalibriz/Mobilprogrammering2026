import { Icon, type IconName } from "@/components/shared/Icon";
import { Theme } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

type ComingSoonProps = {
  icon: IconName;
  title: string;
};

export function ComingSoon({ icon, title }: ComingSoonProps) {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={48} color={Theme.primary} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>Kommer snart</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.md,
    padding: Theme.spacing.xl,
    backgroundColor: Theme.background,
  },
  title: {
    fontSize: Theme.fontSize.xl,
    fontWeight: "700",
    color: Theme.text,
  },
  text: {
    fontSize: Theme.fontSize.md,
    color: Theme.muted,
  },
});

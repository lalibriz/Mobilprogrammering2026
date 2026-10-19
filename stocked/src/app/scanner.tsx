import { Icon } from "@/components/shared/Icon";
import { Theme } from "@/constants/theme";
import { useItemEditor, type Prefill } from "@/contexts/ItemEditorContext";
import { useAudioPlayer } from "expo-audio";
import {
  CameraView,
  useCameraPermissions,
  type BarcodeBounds,
} from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

/** Slår opp navn og bilde i Open Food Facts; tomt objekt hvis ukjent eller offline. */
async function lookup(code: string): Promise<Prefill> {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=product_name,image_front_small_url`,
    );
    const { product } = await res.json();

    return {
      // Skjemaet tillater maks 40 tegn
      name: product?.product_name?.trim().slice(0, 40) || undefined,
      imageUrl: product?.image_front_small_url || undefined,
    };
  } catch {
    return {};
  }
}

const GUIDE = { width: 280, height: 160 };

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const { openAdd } = useItemEditor();
  const router = useRouter();
  // onBarcodeScanned fyrer gjentatte ganger mens koden er i bildet
  const handled = useRef(false);
  const view = useRef({ width: 0, height: 0 });
  const beep = useAudioPlayer(require("@/../assets/sounds/beep.wav"));
  const [bounds, setBounds] = useState<BarcodeBounds>();

  async function onScanned(code: string, found?: BarcodeBounds) {
    if (handled.current) return;

    // Les bare koder hvis midten ligger inne i søkeboksen
    if (found) {
      const x = found.origin.x + found.size.width / 2;
      const y = found.origin.y + found.size.height / 2;

      if (
        Math.abs(x - view.current.width / 2) > GUIDE.width / 2 ||
        Math.abs(y - view.current.height / 2) > GUIDE.height / 2
      ) {
        return;
      }
    }

    handled.current = true;

    beep.play();
    setBounds(found);

    // Vis rammen rundt koden et øyeblikk mens navnet slås opp
    const [product] = await Promise.all([
      lookup(code),
      new Promise((resolve) => setTimeout(resolve, 600)),
    ]);

    router.navigate("/");
    openAdd(product);
  }

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Icon name="barcode" size={64} color={Theme.primary} />
        <Text style={styles.text}>
          Stocked trenger kameratilgang for å skanne
        </Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Gi tilgang</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={styles.camera}
      onLayout={(e) => (view.current = e.nativeEvent.layout)}
    >
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8", "upc_a"] }}
        onBarcodeScanned={({ data, bounds }) => onScanned(data, bounds)}
      />
      <View style={styles.guide} pointerEvents="none" />
      {bounds ? (
        <View
          pointerEvents="none"
          style={[
            styles.found,
            {
              left: bounds.origin.x,
              top: bounds.origin.y,
              width: bounds.size.width,
              height: bounds.size.height,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  guide: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: GUIDE.width,
    height: GUIDE.height,
    marginLeft: -GUIDE.width / 2,
    marginTop: -GUIDE.height / 2,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: Theme.radius.md,
  },
  found: {
    position: "absolute",
    borderWidth: 3,
    borderColor: Theme.primary,
    borderRadius: Theme.radius.sm,
  },
  center: {
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
  button: {
    backgroundColor: Theme.primary,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.md,
  },
  buttonText: {
    color: Theme.textInverted,
    fontWeight: "700",
  },
});

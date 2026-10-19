import { useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

/**
 * Steel fridge door that cracks open with a burst of cold light, swings wide
 * and lets a mist of cold air roll out. Plays once on launch.
 */
export function FridgeDoorIntro() {
  const reduceMotion = useReducedMotion();
  const [done, setDone] = useState(false);
  const { width, height } = useWindowDimensions();
  const open = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return setDone(true);
    // Small crack first (the seal releasing), then a heavy ease-in-out swing
    open.value = withDelay(
      350,
      withSequence(
        withTiming(0.05, { duration: 220, easing: Easing.out(Easing.quad) }),
        withDelay(
          140,
          withTiming(
            1,
            { duration: 1200, easing: Easing.bezier(0.5, 0, 0.2, 1) },
            (finished) => {
              if (finished) runOnJS(setDone)(true);
            },
          ),
        ),
      ),
    );
  }, [reduceMotion, open]);

  // Rotate around the left hinge: shift the pivot from centre to the left edge
  const door = useAnimatedStyle(
    () => ({
      transform: [
        { perspective: 1400 },
        { translateX: -width / 2 },
        { rotateY: `${interpolate(open.value, [0, 1], [0, -105])}deg` },
        { translateX: width / 2 },
      ],
    }),
    [width],
  );

  const shade = useAnimatedStyle(() => ({
    opacity: interpolate(open.value, [0, 1], [0, 0.55]),
  }));

  // A reflection sweeps across the steel as the door turns
  const sheen = useAnimatedStyle(
    () => ({
      opacity: interpolate(open.value, [0, 0.3, 0.8], [0, 0.5, 0]),
      transform: [
        { translateX: interpolate(open.value, [0, 1], [-width * 0.4, width]) },
        { rotate: "12deg" },
      ],
    }),
    [width],
  );

  // Cold white light floods the gap the moment the seal breaks, then clears
  const light = useAnimatedStyle(() => ({
    opacity: interpolate(open.value, [0, 0.05, 0.4, 1], [0, 1, 0.55, 0]),
  }));

  if (done) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View style={[styles.light, light]} />
      <Mist open={open} x={width * 0.2} y={height * 0.78} size={260} lift={140} />
      <Mist open={open} x={width * 0.6} y={height * 0.7} size={320} lift={190} />
      <Mist open={open} x={width * 0.4} y={height * 0.88} size={220} lift={110} />
      <Animated.View style={[styles.door, door]}>
        <View style={styles.handle} />
        <Animated.View style={[styles.sheen, sheen]} />
        <Animated.View style={[StyleSheet.absoluteFill, styles.shade, shade]} />
      </Animated.View>
    </View>
  );
}

type MistProps = {
  open: SharedValue<number>;
  x: number;
  y: number;
  size: number;
  lift: number;
};

/** A soft cloud that rises and fades as the door opens. */
function Mist({ open, x, y, size, lift }: MistProps) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(open.value, [0.1, 0.55, 1], [0, 0.8, 0]),
    transform: [
      { translateY: interpolate(open.value, [0, 1], [40, -lift]) },
      { scale: interpolate(open.value, [0, 1], [0.7, 1.4]) },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.mist,
        { left: x - size / 2, top: y - size / 2, width: size, height: size },
        { borderRadius: size / 2 },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
  },
  light: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#eafcff",
  },
  mist: {
    position: "absolute",
    backgroundColor: "rgba(235,250,255,0.55)",
    boxShadow: [
      { offsetX: 0, offsetY: 0, blurRadius: 80, spreadDistance: 20, color: "rgba(235,250,255,0.8)" },
    ],
  },
  // Brushed steel door with a slim graphite bar handle
  door: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#b8c0c7",
    experimental_backgroundImage: "linear-gradient(180deg, #e6eaee, #bcc4cb 45%, #a3adb5)",
    borderRightWidth: 6,
    borderRightColor: "#8a949c",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  handle: {
    width: 10,
    height: 280,
    marginRight: 28,
    borderRadius: 5,
    backgroundColor: "#2b3440",
  },
  sheen: {
    position: "absolute",
    top: -80,
    bottom: -80,
    width: 90,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  shade: {
    backgroundColor: "#10161c",
  },
});

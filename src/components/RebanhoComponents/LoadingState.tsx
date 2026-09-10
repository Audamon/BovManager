import { useTheme } from "@/hooks/use-theme";
import { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import IconBadge from "../icons/IconBadge";

const LoadingState = () => {
  const [opacity] = useState(() => new Animated.Value(1));
  const theme = useTheme();
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.4, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);
  return (
    <View style={style.body}>
      <Animated.View
        testID="loading-placeholder"
        style={[style.box, { opacity, backgroundColor: theme.surface }]}
      >
        <IconBadge backgroundColor={theme.backgroundElement} />
        <View style={style.capsuleRow}>
          <View style={[style.longCapsule, { backgroundColor: theme.backgroundElement }]}></View>
          <View style={[style.shortCapsule, { backgroundColor: theme.backgroundElement }]}></View>
        </View>
      </Animated.View>
      <Animated.View
        testID="loading-placeholder"
        style={[style.box, { opacity, backgroundColor: theme.surface }]}
      >
        <IconBadge backgroundColor={theme.backgroundElement} />
        <View style={style.capsuleRow}>
          <View style={[style.longCapsule, { backgroundColor: theme.backgroundElement }]}></View>
          <View style={[style.shortCapsule, { backgroundColor: theme.backgroundElement }]}></View>
        </View>
      </Animated.View>
      <Animated.View
        testID="loading-placeholder"
        style={[style.box, { opacity, backgroundColor: theme.surface }]}
      >
        <IconBadge backgroundColor={theme.backgroundElement} />
        <View style={style.capsuleRow}>
          <View style={[style.longCapsule, { backgroundColor: theme.backgroundElement }]}></View>
          <View style={[style.shortCapsule, { backgroundColor: theme.backgroundElement }]}></View>
        </View>
      </Animated.View>
      <Animated.View
        testID="loading-placeholder"
        style={[style.box, { opacity, backgroundColor: theme.surface }]}
      >
        <IconBadge backgroundColor={theme.backgroundElement} />
        <View style={style.capsuleRow}>
          <View style={[style.longCapsule, { backgroundColor: theme.backgroundElement }]}></View>
          <View style={[style.shortCapsule, { backgroundColor: theme.backgroundElement }]}></View>
        </View>
      </Animated.View>
    </View>
  );
};
const style = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: 16,
    gap: 10,
  },
  box: {
    height: 71,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    flexDirection: "row",
  },
  fakeIcon: {
    height: 40,
    width: 40,
    borderRadius: 10,
  },
  capsuleRow: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 8,
  },
  longCapsule: {
    borderRadius: 8,
    height: 13,
    width: "53%",
  },
  shortCapsule: {
    borderRadius: 8,
    height: 13,
    width: "33%",
  },
});
export default LoadingState;

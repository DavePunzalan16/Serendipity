/** Animated pulse placeholder for loading states. */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
}

export default function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
}: SkeletonProps): JSX.Element {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [opacity]);

  const style: Animated.AnimatedProps<ViewStyle> = {
    width: width as number,
    height,
    borderRadius,
    opacity,
  };

  return <Animated.View style={[styles.skeleton, style]} />;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#484848',
  },
});

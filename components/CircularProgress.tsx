import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const CircularProgress = ({
  value,
  maxValue,
  inPercent,
  size = 100,
  strokeWidth = 10,
  style,
}: {
  value: number;
  maxValue: number;
  inPercent?: boolean;
  size?: number;
  strokeWidth?: number;
  style?: any;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = (value / maxValue) * 100;
  const progress = (percentage / 100) * circumference;

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={percentage > 100 ? "#7e6cb1" : "#e0e0e0"}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#7e6cb1"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      <View style={{ position: "absolute" }}>
        {inPercent && (
          <Text
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {Math.round(percentage)}%
          </Text>
        )}
        {!inPercent && (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {Math.round(value)}/{maxValue}
            </Text>
            <Text>{inPercent ? "%" : "ккал"}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default CircularProgress;

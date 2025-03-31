import React from "react";

import { View, Text } from "react-native";

const UnorderedList = ({ texts }: { texts: string[] }) => {
  return (
    <Column>
      {texts.map((t, index) => (
        <Row key={index}>
          <Column
            style={{
              alignSelf: "flex-start",
              justifyContent: "flex-start",
              marginRight: 12,
              transform: [{ scale: 2.5 }],
            }}
          >
            <Text
              style={{
                alignSelf: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              {"\u2022"}
            </Text>
          </Column>
          <Column>
            <Text>{t}</Text>
          </Column>
        </Row>
      ))}
    </Column>
  );
};

const Column = ({ children, style }: { children: any; style?: any }) => {
  return (
    <View style={[{ display: "flex", flexDirection: "column" }, style]}>
      {children}
    </View>
  );
};

const Row = ({ children, style }: { children: any; style?: any }) => {
  return (
    <View style={[{ display: "flex", flexDirection: "row" }, style]}>
      {children}
    </View>
  );
};

export default UnorderedList;

import React, { memo, FC } from "react";
import { Text, View } from "react-native";
import { pairStyles } from "./Pair.style";
import { IPair } from "@/Utils/Types/pair";
import { Priceformat } from "@/Utils/helpers";

const Pair: FC<IPair> = (item) => {
  return (
    <View style={pairStyles.container}>
      <View style={pairStyles.texts}>
        <Text>
          Price: 
          <Text style={pairStyles.bold}>
            {Priceformat(Number(item.price))} $
          </Text>
        </Text>
        <Text>
          Qty: <Text style={pairStyles.bold}>{item.quantity}</Text>
        </Text>
      </View>
      <Text>Time: {item.time}</Text>
    </View>
  );
};

export default memo(Pair);

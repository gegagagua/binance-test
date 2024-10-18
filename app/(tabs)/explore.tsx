import React, { useState, useRef } from "react";
import { SafeAreaView, Text, FlatList, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { mainTabStyles } from "./style/main.style";
import Pair from "@/components/shared/Pair/Pair";
import { CountSavedData, PairCoins, SocketUrl } from "@/Utils/const";
import { IPair } from "@/Utils/Types/pair";

export default function Explore() {
  const [trades, setTrades] = useState<IPair[]>([]);
  const [timeAveragePerMinute, setTimeAveragePerMinute] = useState<{ time: string, averagePrice: number }[]>([]);
  let socket: WebSocket | null = null;
  const tradeBuffer = useRef<IPair[]>([]);
  const minuteTrades = useRef<IPair[]>([]);

  const getSocketData = () => {
    socket = new WebSocket(`${SocketUrl}/ws/${PairCoins}@trade`);

    socket.onmessage = (event) => {
      const tradeData = JSON.parse(event.data);
      const newTrade: IPair = {
        price: parseFloat(tradeData.p),
        quantity: tradeData.q,
        time: new Date(tradeData.T).toLocaleTimeString(),
      };

      tradeBuffer.current.push(newTrade);
      minuteTrades.current.push(newTrade);
    };
  };

  const calculateAveragePrice = () => {
    if (minuteTrades.current.length > 0) {
      const totalPrice = minuteTrades.current.reduce((acc, trade) => acc + trade.price, 0);
      const averagePrice = totalPrice / minuteTrades.current.length;
      const time = new Date().toLocaleTimeString();

      setTimeAveragePerMinute((prevAverages) => [
        { time, averagePrice },
        ...prevAverages
      ]);

      minuteTrades.current = [];
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setTrades([]);
      getSocketData();

      const tradeInterval = setInterval(() => {
        if (tradeBuffer.current.length > 0) {
          setTrades((prevTrades) => {
            const updatedTrades = [...tradeBuffer.current, ...prevTrades].slice(0, CountSavedData);
            return updatedTrades;
          });
          tradeBuffer.current = [];
        }
      }, 1000);

      const minuteInterval = setInterval(() => {
        calculateAveragePrice();
      }, 60000);

      return () => {
        setTrades([]);
        if (socket) {
          socket.close();
          socket = null;
        }
        clearInterval(tradeInterval);
        clearInterval(minuteInterval);
      };
    }, [])
  );

  return (
    <SafeAreaView style={mainTabStyles.container}>
      <Text style={mainTabStyles.title}>BTC/USDT Per min</Text>
      <FlatList
        data={trades}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => <Pair {...item} />}
      />
      <View style={{ height: 100, paddingTop: 24 }}>
        <Text>Minutes Prices:</Text>
        {timeAveragePerMinute.map((item, index) => (
          <Text key={index}>
            {item.time}: {item.averagePrice.toFixed(2)} $
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
}

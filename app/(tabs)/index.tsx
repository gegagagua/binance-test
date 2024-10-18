import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView, Text, FlatList, View, TextInput } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { mainTabStyles } from "./style/main.style";
import Pair from "@/components/shared/Pair/Pair";
import { CountSavedData, PairCoins, SocketUrl } from "@/Utils/const";
import { IPair } from "@/Utils/Types/pair";
import Toast from "react-native-toast-message";

export default function HomeScreen() {
  const [trades, setTrades] = useState<IPair[]>([]);
  let socket: WebSocket | null = null;
  const tradeBuffer = useRef<IPair[]>([]);
  const [min, setMin] = useState<number | null>(null);
  const [max, setMax] = useState<number | null>(null);

  useEffect(() => {
    trades.forEach((item) => {
      if (min) {
        if (item.price < min) {
          Toast.show({
            position: "top",
            type: "error",
            text1: "Min happened",
            text2: `Min price now is ${item.price} $`,
          });
        }
      }

      if (max) {
        if (item.price > max) {
          Toast.show({
            position: "top",
            type: "success",
            text1: "Max happened",
            text2: `Max price now is ${item.price} $`,
          });
        }
      }
    })
  }, [min, max, trades])

  const getSocketData = () => {
    socket = new WebSocket(`${SocketUrl}/ws/${PairCoins}@trade`);

    socket.onmessage = (event) => {
      const tradeData = JSON.parse(event.data);
      const newTrade: IPair = {
        price: tradeData.p,
        quantity: tradeData.q,
        time: new Date(tradeData.T).toLocaleTimeString(),
      };

      console.log('newTrade', tradeData.T)
      tradeBuffer.current.push(newTrade);
    };
  };

  useFocusEffect(
    React.useCallback(() => {
      setTrades([]);
      setMin(null)
      setMax(null)
      getSocketData();

      const interval = setInterval(() => {
        if (tradeBuffer.current.length > 0) {
          setTrades((prevTrades) => {
            const updatedTrades = [...tradeBuffer.current, ...prevTrades].slice(
              0,
              CountSavedData
            );

            return updatedTrades;
          });
          tradeBuffer.current = [];
        }
      }, 1000);

      return () => {
        setTrades([]);
        if (socket) {
          socket.close();
          socket = null;
          setMin(null)
          setMax(null)
        }
        clearInterval(interval);
      };
    }, [])
  );

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeoutMax = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (value: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setMin(Number(value));
    }, 500);
  };

  const handleMaxInputChange = (value: string) => {
    if (debounceTimeoutMax.current) {
      clearTimeout(debounceTimeoutMax.current);
    }

    debounceTimeoutMax.current = setTimeout(() => {
      setMax(Number(value));
    }, 1000);
  };

  return (
    <SafeAreaView style={mainTabStyles.container}>
      <Text style={mainTabStyles.title}>BTC/USDT Trades</Text>

      <FlatList
        data={trades}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => <Pair {...item} />}
      />

      <View style={mainTabStyles.inputs}>
        <TextInput
          defaultValue={`${min ? min : ''}`}
          keyboardType="number-pad"
          onChangeText={handleInputChange} 
          placeholder="Min:"
          style={mainTabStyles.input}
        />
        <TextInput
          defaultValue={`${max ? max : ''}`}
          keyboardType="number-pad"
          placeholder="Max:"
          onChangeText={handleMaxInputChange}
          style={mainTabStyles.input}
        />
      </View>

      <Toast />
    </SafeAreaView>
  );
}

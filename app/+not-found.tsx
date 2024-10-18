import { SafeAreaView, StyleSheet, Text } from 'react-native';


export default function NotFoundScreen() {
  return (
    <SafeAreaView>
      <Text>Not found</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});

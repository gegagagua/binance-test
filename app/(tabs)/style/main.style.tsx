import { StyleSheet } from "react-native";

export const mainTabStyles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputs: {
    height: 50,
    marginTop: 16,
    justifyContent: 'space-between',
    gap: 16,
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    color: '#000',
    paddingLeft: 8,
    height: 48
  }
});

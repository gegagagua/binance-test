import { StyleSheet } from "react-native";

export const pairStyles = StyleSheet.create({
    container: {
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        marginBottom: 8,
        paddingBottom: 4,
    },
    texts: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bold: {
        color: '#000',
        fontWeight: 'bold'
    }
})
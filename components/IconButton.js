import {Pressable, StyleSheet, Text} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";

const IconButton = ({icon, label, onPress }) => {
    return(
        <Pressable onPress={onPress} style={styles.iconButton}>
            <MaterialIcons name={icon} size={24} color={"#fff"} />
            <Text style={styles.iconButtonLabel}>{label}</Text>
        </Pressable>
    )
}; export default IconButton;

const styles = StyleSheet.create({
    iconButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButtonLabel: {
        color: '#fff',
        marginTop: 12,
    },
});

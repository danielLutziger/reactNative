import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View, Platform} from 'react-native';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import ImageViewer from "./components/ImageViewer";
import Button from "./components/Button";
import IconButton from "./components/IconButton";
import CircleButton from "./components/CircleButton";
import {useRef, useState} from "react";
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from "./components/EmojiList";
import EmojiSticker from "./components/EmojiSticker";
const pathToImage = require('./assets/images/background-image.png');
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from "expo-media-library";
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';
import * as SplashScreen from 'expo-splash-screen';
export default function App() {

    SplashScreen.preventAutoHideAsync();
    setTimeout(SplashScreen.hideAsync, 3000);

    const [selectedImage, setSelectedImage] = useState(null);
    const [showAppOptions, setAppOptions] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pickedEmoji, setPickedEmoji] = useState(null);
    const [status, requestPermission] = MediaLibrary.usePermissions();

    const imageRef = useRef();

    if(status === null){
        requestPermission();
    }
    const pickImageAsync = async () => {
        const results = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1
        });
        if (!results.canceled) {
            console.log(results);
            setSelectedImage(results.assets[0].uri);
            setAppOptions(true);
        } else {
            alert("No img selected");
        }
    }

    const onReset = () => {
        setAppOptions(false);
        setPickedEmoji(null);
    }

    const onAddSticker = () => {
        setIsModalVisible(true);
    }

    const onModalClose = () => {
        setIsModalVisible(false);
    }

    const onSaveImageAsync = async () => {
        if (Platform.OS !== 'web') {
            try {
                const localUri = await captureRef(imageRef, {
                    height: 440,
                    quality: 1,
                });
                await MediaLibrary.saveToLibraryAsync(localUri);
                if (localUri) {
                    alert('Saved!');
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                const dataUrl = await domtoimage.toJpeg(imageRef.current, {
                    quality: 0.95,
                    width: 320,
                    height: 440,
                });

                let link = document.createElement('a');
                link.download = 'sticker-smash.jpeg';
                link.href = dataUrl;
                link.click();
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.imageContainer}>
                <View ref={imageRef} collapsable={false}>
                    <ImageViewer placeHolderImage={pathToImage} selectedImage={selectedImage}/>
                    {pickedEmoji !== null ? <EmojiSticker imageSize={40} stickerSource={pickedEmoji} /> : null}
                </View>
            </View>
            {showAppOptions ? (
                <View style={styles.optionsContainer}>
                    <View style={styles.optionsRow}>
                        <IconButton icon={"refresh"} label={"reset"} onPress={onReset}/>
                        <CircleButton onPress={onAddSticker}/>
                        <IconButton icon={"save-alt"} label={"save"} onPress={onSaveImageAsync}/>
                    </View>
                </View>
            ) : (
                <View style={styles.footerContainer}>
                    <Button label={"Choose a photo"} theme={"primary"} onPress={pickImageAsync}/>
                    <Button label={"Use this photo"} onPress={() => setAppOptions(true)}/>
                </View>
            )}
            <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
                <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
            </EmojiPicker>
            <StatusBar style="auto"/>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
    },
    imageContainer : {
        flex: 1,
        paddingTop: 50
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: "center"
    },
    optionsContainer: {
        position: "absolute",
        bottom: 80
    },
    optionsRow: {
        alignItems: "center",
        flexDirection: "row"
    }
});

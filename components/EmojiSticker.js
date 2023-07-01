import {Image, View} from "react-native";
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
    useAnimatedGestureHandler
} from "react-native-reanimated";
import {PanGestureHandler, TapGestureHandler} from "react-native-gesture-handler";


export default function EmojiSticker({imageSize, stickerSource}) {

    const AnimatedImage = Animated.createAnimatedComponent(Image);
    const scaleImage = useSharedValue(imageSize);

    const AnimatedView = Animated.createAnimatedComponent(View);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);


    const onDoubleTap = useAnimatedGestureHandler({
        onActive: () => {
            if (scaleImage.value !== imageSize * 2) {
                scaleImage.value = imageSize * 2;
            }
        }
    });

    const imageStyle = useAnimatedStyle(() => {
        return {
            width: withSpring(scaleImage.value),
            height: withSpring(scaleImage.value)
        }
    })

    const onDrag = useAnimatedGestureHandler({
        onStart: (event, context) => {
            context.translateX = translateX.value;
            context.translateY = translateY.value;
        },
        onActive: (event, context) => {
            translateX.value = event.translationX + context.translateX;
            translateY.value = event.translationY + context.translateY;
        }
    })

    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: translateX.value,
                },
                {
                    translateY: translateY.value,
                },
            ],
        };
    });

    return (
        <PanGestureHandler onGestureEvent={onDrag}>
            <AnimatedView style={[containerStyle, {top: -350}]}>
                <TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}>
                    <AnimatedImage source={stickerSource} style={[imageStyle, {width: imageSize, height: imageSize}]}/>
                </TapGestureHandler>
            </AnimatedView>
        </PanGestureHandler>
    )
}

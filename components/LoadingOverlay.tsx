import { Ionicons } from '@expo/vector-icons'
import { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, Text, View } from 'react-native'

type LoadingOverlayProps = {
    visible: boolean
    label?: string
    variant?: 'overlay' | 'inline'
}

const RING_COUNT = 3

export default function LoadingOverlay({ visible, label, variant = 'overlay' }: LoadingOverlayProps) {
    const ringAnims = useRef(Array.from({ length: RING_COUNT }, () => new Animated.Value(0))).current
    const rotateAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (!visible) return

        const ringLoops = ringAnims.map((anim, index) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(index * 400),
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 1200,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
                ]),
            ),
        )

        const rotateLoop = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2400,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        )

        ringLoops.forEach((loop) => loop.start())
        rotateLoop.start()

        return () => {
            ringLoops.forEach((loop) => loop.stop())
            rotateLoop.stop()
            ringAnims.forEach((anim) => anim.setValue(0))
            rotateAnim.setValue(0)
        }
    }, [visible])

    if (!visible) return null

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    })

    return (
        <View style={variant === 'overlay' ? styles.overlay : styles.inline}>
            <View style={styles.pulseWrap}>
                {ringAnims.map((anim, index) => {
                    const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.4] })
                    const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] })
                    return <Animated.View key={index} style={[styles.ring, { transform: [{ scale }], opacity }]} />
                })}

                <Animated.View style={[styles.core, { transform: [{ rotate: spin }] }]}>
                    <Ionicons name='flash' size={26} color='#FFFFFF' />
                </Animated.View>
            </View>

            {label ? <Text style={styles.label}>{label}</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 42, 30, 0.55)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    inline: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
    },
    pulseWrap: {
        width: 76,
        height: 76,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    ring: {
        position: 'absolute',
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: '#4ADE80',
    },
    core: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#16352A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFFFFF',
    },
})

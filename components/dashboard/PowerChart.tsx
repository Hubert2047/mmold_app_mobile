import { IHistoryStacked } from '@/src/type'
import { useTranslation } from 'react-i18next'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { LineChart } from 'react-native-chart-kit'

const screenWidth = Dimensions.get('window').width

type Props = {
    chart: IHistoryStacked
    contractCapacity: number
}

export function PowerChart({ chart, contractCapacity }: Props) {
    const { t } = useTranslation()

    const totalPoints = chart.buckets.length
    const labelStep = Math.max(1, Math.ceil(totalPoints / 6))

    const labels = chart.buckets.map((b, i) => (i % labelStep === 0 ? b.label : ''))
    const values = chart.buckets.map((b) => Object.values(b.values).reduce((sum, v) => sum + v, 0))

    const chartConfig = {
        backgroundGradientFrom: '#FFFFFF',
        backgroundGradientTo: '#FFFFFF',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
        propsForDots: { r: '0' },
        propsForBackgroundLines: { strokeDasharray: '4', stroke: '#F0F0F0' },
        propsForLabels: { fontSize: 10 },
    }

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{t('dashboard.topDevicesChart')}</Text>

            <View>
                <LineChart
                    data={{
                        labels,
                        datasets: [{ data: values.length ? values : [0] }],
                    }}
                    width={screenWidth - 64}
                    height={180}
                    chartConfig={chartConfig}
                    bezier
                    withInnerLines
                    withOuterLines={false}
                    withShadow={false}
                    style={styles.chart}
                />

                <View style={styles.contractLabel}>
                    <Text style={styles.contractText}>
                        {t('dashboard.contractCapacity')} {contractCapacity}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
    },
    title: { fontSize: 13, color: '#374151', marginBottom: 8, fontWeight: '600' },
    chart: { borderRadius: 8, marginLeft: -16 },
    contractLabel: {
        position: 'absolute',
        top: 8,
        right: 0,
    },
    contractText: { fontSize: 10, color: '#DC2626' },
})

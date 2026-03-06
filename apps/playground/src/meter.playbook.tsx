import * as React from 'react';
import { View, Text } from 'react-native';
import styles from './playbookStyles';
import { Meter } from '@base-ui-rn/meter';
import {
	Gallery,
	Section,
} from '@base-ui-rn/playbook';

export function MeterPlaybook() {
	return (
		<Gallery title='Meter'>
			<Section title='Basic'>
				<View style={styles.container}>
					<Meter.Root
						value={24}
						style={styles.meterRoot}
					>
						<View style={styles.meterHeader}>
							<Meter.Label style={styles.meterLabel}>Storage Used</Meter.Label>
							<Meter.Value style={styles.meterValue} />
						</View>
						<Meter.Track style={styles.meterTrack}>
							<Meter.Indicator style={styles.meterIndicator} />
						</Meter.Track>
					</Meter.Root>
				</View>
			</Section>

			<Section title='Custom Range (0-500)'>
				<View style={styles.container}>
					<Meter.Root
						value={350}
						min={0}
						max={500}
						style={styles.meterRoot}
					>
						<View style={styles.meterHeader}>
							<Meter.Label style={styles.meterLabel}>Points</Meter.Label>
							<Meter.Value style={styles.meterValue}>
								{(formattedValue, value) => `${value} / 500`}
							</Meter.Value>
						</View>
						<Meter.Track style={styles.meterTrack}>
							<Meter.Indicator style={[styles.meterIndicator, { backgroundColor: '#10B981' }]} />
						</Meter.Track>
					</Meter.Root>
				</View>
			</Section>

			<Section title='Formatted Value (Currency)'>
				<View style={styles.container}>
					<Meter.Root
						value={750}
						max={1000}
						format={{ style: 'currency', currency: 'USD' }}
						style={styles.meterRoot}
					>
						<View style={styles.meterHeader}>
							<Meter.Label style={styles.meterLabel}>Budget</Meter.Label>
							<Meter.Value style={styles.meterValue} />
						</View>
						<Meter.Track style={styles.meterTrack}>
							<Meter.Indicator style={[styles.meterIndicator, { backgroundColor: '#F59E0B' }]} />
						</Meter.Track>
					</Meter.Root>
				</View>
			</Section>

			<Section title='Custom Accessibility Text'>
				<View style={styles.container}>
					<Meter.Root
						value={85}
						getAriaValueText={(value) => `${value}% critical`}
						style={styles.meterRoot}
					>
						<View style={styles.meterHeader}>
							<Meter.Label style={styles.meterLabel}>CPU Load</Meter.Label>
							<Meter.Value style={styles.meterValue} />
						</View>
						<Meter.Track style={styles.meterTrack}>
							<Meter.Indicator style={[styles.meterIndicator, { backgroundColor: '#EF4444' }]} />
						</Meter.Track>
					</Meter.Root>
					<Text style={styles.hint}>
						Check screen reader output for "85% critical"
					</Text>
				</View>
			</Section>
		</Gallery>
	);
}

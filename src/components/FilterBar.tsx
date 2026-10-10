import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';
import type { Filter, InsertEdge } from '../types';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Open' },
  { key: 'done', label: 'Done' },
];

const INSERT_EDGES: { edge: InsertEdge; label: string; accessibilityLabel: string }[] = [
  { edge: 'top', label: 'T', accessibilityLabel: 'Add to top' },
  { edge: 'bottom', label: 'B', accessibilityLabel: 'Add to bottom' },
];

type Props = {
  value: Filter;
  onChange: (filter: Filter) => void;
  insertAt: InsertEdge;
  onInsertAtChange: (edge: InsertEdge) => void;
};

export function FilterBar({ value, onChange, insertAt, onInsertAtChange }: Props) {
  return (
    <View style={styles.row}>
      {FILTERS.map((item) => {
        const active = item.key === value;
        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
      <View style={styles.insertPair}>
        {INSERT_EDGES.map((item) => {
          const selected = item.edge === insertAt;
          return (
            <Pressable
              key={item.edge}
              onPress={() => onInsertAtChange(item.edge)}
              accessibilityRole="button"
              accessibilityLabel={item.accessibilityLabel}
              accessibilityState={{ selected }}
              aria-selected={selected}
              hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
              style={[styles.insertBtn, selected && styles.insertBtnOn]}
            >
              <Text style={[styles.insertLabel, selected && styles.insertLabelOn]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
    flexShrink: 0,
  },
  insertPair: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  insertBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insertBtnOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  insertLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '800',
  },
  insertLabelOn: {
    color: colors.text,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  labelActive: {
    color: colors.text,
  },
});

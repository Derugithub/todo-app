import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';
import type { Filter, InsertEdge } from '../types';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Open' },
  { key: 'done', label: 'Done' },
];

type Props = {
  value: Filter;
  onChange: (filter: Filter) => void;
  insertAt: InsertEdge;
  onToggleInsert: () => void;
};

export function FilterBar({ value, onChange, insertAt, onToggleInsert }: Props) {
  const addingOnTop = insertAt === 'top';
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
      <Pressable
        onPress={onToggleInsert}
        accessibilityRole="button"
        accessibilityLabel={addingOnTop ? 'New tasks are added on top' : 'New tasks are added at the bottom'}
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        style={styles.insertBtn}
      >
        <Text style={styles.insertLabel}>{addingOnTop ? 'T' : 'B'}</Text>
      </Pressable>
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
  insertBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insertLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
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

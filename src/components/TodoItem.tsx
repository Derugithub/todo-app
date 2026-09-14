import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';
import type { Todo } from '../types';

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <View style={[styles.card, todo.done && styles.cardDone]}>
      <Pressable
        onPress={() => onToggle(todo.id)}
        style={styles.row}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.done }}
      >
        <View style={[styles.checkbox, todo.done && styles.checkboxOn]}>
          {todo.done ? <Text style={styles.checkMark}>✓</Text> : null}
        </View>
        <Text style={[styles.label, todo.done && styles.labelDone]} numberOfLines={3}>
          {todo.text}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onDelete(todo.id)}
        style={styles.deleteBtn}
        hitSlop={8}
        accessibilityLabel="Delete task"
      >
        <Text style={styles.deleteIcon}>×</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    marginBottom: 10,
  },
  cardDone: {
    opacity: 0.72,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.textDim,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkMark: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginTop: -1,
  },
  label: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  labelDone: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    color: colors.textDim,
    fontSize: 26,
    fontWeight: '300',
    marginTop: -2,
  },
});

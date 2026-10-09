import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FilterBar } from './src/components/FilterBar';
import { TodoItem } from './src/components/TodoItem';
import { colors, radius, spacing } from './src/theme';
import type { Filter, Todo } from './src/types';

const SEED: Todo[] = [
  { id: '1', text: 'Sketch the crimson layout', done: true, createdAt: 1 },
  { id: '2', text: 'Ship the first todo', done: false, createdAt: 2 },
];

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(SEED);
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const inputRef = useRef<TextInput>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    focusInput();
  }, []);

  const remaining = todos.filter((t) => !t.done).length;
  const doneCount = todos.length - remaining;
  const progress = todos.length === 0 ? 0 : doneCount / todos.length;

  const visible = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.done);
    if (filter === 'done') return todos.filter((t) => t.done);
    return todos;
  }, [filter, todos]);

  const addTodo = () => {
    const text = draft.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: Date.now().toString(), text, done: false, createdAt: Date.now() },
      ...prev,
    ]);
    setDraft('');
    requestAnimationFrame(focusInput);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const clearDone = () => {
    if (doneCount === 0) return;
    const run = () => setTodos((prev) => prev.filter((t) => !t.done));
    if (Platform.OS === 'web') {
      run();
      return;
    }
    Alert.alert('Clear finished?', 'Completed tasks will be removed.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: run },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.kicker}>NOIRLIST</Text>
          <Text style={styles.title}>Do the work.</Text>
          <Text style={styles.subtitle}>
            {remaining === 0
              ? todos.length === 0
                ? 'Nothing queued. Add a task.'
                : 'All clear. Nice.'
              : `${remaining} open · ${doneCount} done`}
          </Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
          </View>
        </View>

        <View style={styles.composer}>
          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={setDraft}
            placeholder="New task"
            placeholderTextColor={colors.textDim}
            style={styles.input}
            returnKeyType="done"
            blurOnSubmit={false}
            autoFocus
            onSubmitEditing={addTodo}
          />
          <Pressable
            onPress={addTodo}
            accessibilityRole="button"
            accessibilityLabel="Add"
            style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
          >
            <Text style={styles.addLabel}>Add</Text>
          </Pressable>
        </View>

        <View style={styles.toolbar}>
          <FilterBar value={filter} onChange={setFilter} />
          {doneCount > 0 ? (
            <Pressable onPress={clearDone} style={styles.clearBtn}>
              <Text style={styles.clearLabel}>Clear done</Text>
            </Pressable>
          ) : null}
        </View>

        <FlatList
          data={visible}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TodoItem todo={item} onToggle={toggleTodo} onDelete={deleteTodo} />
          )}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyMark} />
              <Text style={styles.emptyTitle}>Empty lane</Text>
              <Text style={styles.emptyCopy}>
                {filter === 'done'
                  ? 'No finished tasks yet.'
                  : filter === 'active'
                    ? 'No open tasks. Add one above.'
                    : 'Start with a single, sharp task.'}
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  kicker: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    marginTop: 6,
    marginBottom: 18,
  },
  progressTrack: {
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
  },
  composer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  input: {
    flex: 1,
    height: 52,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 16,
  },
  addBtn: {
    height: 52,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accentGlow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  addBtnPressed: {
    backgroundColor: colors.accentMuted,
  },
  addLabel: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.4,
  },
  toolbar: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  clearBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  clearLabel: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 56,
  },
  emptyMark: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentMuted,
    marginBottom: 16,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyCopy: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 240,
  },
});

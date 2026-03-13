import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';
import Toast from 'react-native-toast-message';

interface TimeRecordFormProps {}

export default function TimeRecordFormScreen() {
  const router = useSafeRouter();
  const params = useSafeSearchParams<{ id?: string }>();
  const styles = useMemo(() => createStyles(), []);

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [project, setProject] = useState('');
  const [task, setTask] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const isEdit = !!params.id;

  useEffect(() => {
    if (isEdit && params.id) {
      fetchRecord(params.id);
    } else {
      // 设置默认日期为今天
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
    }
  }, [isEdit, params.id]);

  const fetchRecord = async (id: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/time-records/${id}`);
      const json = await response.json();

      if (json.error) {
        Toast.show({
          type: 'error',
          text1: '加载失败',
          text2: json.error,
        });
        return;
      }

      const record = json.data;
      setDate(record.date);
      setStartTime(record.start_time);
      setEndTime(record.end_time || '');
      setProject(record.project || '');
      setTask(record.task || '');
      setNotes(record.notes || '');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: '加载失败',
        text2: error.message,
      });
    }
  };

  const handleSave = async () => {
    if (!date || !startTime) {
      Toast.show({
        type: 'error',
        text1: '验证失败',
        text2: '请填写日期和开始时间',
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        date,
        start_time: startTime,
        end_time: endTime || null,
        project: project || null,
        task: task || null,
        notes: notes || null,
      };

      const url = isEdit
        ? `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/time-records/${params.id}`
        : `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/time-records`;

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (json.error) {
        Toast.show({
          type: 'error',
          text1: '保存失败',
          text2: json.error,
        });
        return;
      }

      Toast.show({
        type: 'success',
        text1: '成功',
        text2: isEdit ? '记录已更新' : '记录已创建',
      });

      router.back();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: '保存失败',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!isEdit) return;

    Alert.alert('确认删除', '确定要删除这条记录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await fetch(
              `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/time-records/${params.id}`,
              {
                method: 'DELETE',
              }
            );

            if (!response.ok) {
              throw new Error('删除失败');
            }

            Toast.show({
              type: 'success',
              text1: '成功',
              text2: '记录已删除',
            });

            router.back();
          } catch (error: any) {
            Toast.show({
              type: 'error',
              text1: '删除失败',
              text2: error.message,
            });
          }
        },
      },
    ]);
  };

  const renderInput = (
    label: string,
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    icon: string,
    multiline = false
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <FontAwesome6 name={icon as any} size={18} color="#B2BEC3" />
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          placeholder={placeholder}
          placeholderTextColor="#B2BEC3"
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
        />
      </View>
    </View>
  );

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="arrow-left" size={22} color="#6C63FF" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle} variant="h3">
            {isEdit ? '编辑记录' : '添加记录'}
          </ThemedText>
          <View style={styles.headerRight}>
            {isEdit && (
              <TouchableOpacity onPress={handleDelete} activeOpacity={0.7}>
                <FontAwesome6 name="trash" size={22} color="#FF6B6B" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.sectionTitle}>
            <ThemedText style={styles.sectionTitleText} variant="h3">
              基本信息
            </ThemedText>
          </View>

          {renderInput('日期', '选择日期', date, setDate, 'calendar')}
          {renderInput('开始时间', '开始时间', startTime, setStartTime, 'clock')}
          {renderInput('结束时间', '结束时间（可选）', endTime, setEndTime, 'stopwatch')}

          <View style={styles.sectionTitle}>
            <ThemedText style={styles.sectionTitleText} variant="h3">
              项目任务
            </ThemedText>
          </View>

          {renderInput('项目', '项目名称', project, setProject, 'briefcase')}
          {renderInput('任务', '任务描述', task, setTask, 'list-check')}
          {renderInput('备注', '备注说明（可选）', notes, setNotes, 'sticky-note', true)}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.9}
            disabled={loading}
          >
            <ThemedText style={styles.saveButtonText} variant="h4">
              {loading ? '保存中...' : '保存'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

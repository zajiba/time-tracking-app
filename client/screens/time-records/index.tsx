import React, { useState, useCallback, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';
import { useFocusEffect } from 'expo-router';
import Toast from 'react-native-toast-message';

interface TimeRecord {
  id: string;
  date: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  project: string | null;
  task: string | null;
  notes: string | null;
}

export default function TimeRecordsScreen() {
  const router = useSafeRouter();
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const styles = useMemo(() => createStyles(), []);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/time-records`);
      const json = await response.json();

      if (json.error) {
        Toast.show({
          type: 'error',
          text1: '加载失败',
          text2: json.error,
        });
        return;
      }

      setRecords(json.data || []);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: '加载失败',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRecords();
    }, [fetchRecords])
  );

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/time-records/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      Toast.show({
        type: 'success',
        text1: '成功',
        text2: '记录已删除',
      });

      fetchRecords();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: '删除失败',
        text2: error.message,
      });
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/time-records/export/all`);
      const json = await response.json();

      if (json.error) {
        Toast.show({
          type: 'error',
          text1: '导出失败',
          text2: json.error,
        });
        return;
      }

      // 保存到文件（简化实现，实际可以使用 expo-file-system 或 expo-sharing）
      const dataStr = JSON.stringify(json, null, 2);
      console.log('导出数据:', dataStr);

      Toast.show({
        type: 'success',
        text1: '导出成功',
        text2: '数据已准备好，可发送给 AI 分析',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: '导出失败',
        text2: error.message,
      });
    }
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '--';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins > 0 ? `${mins}分钟` : ''}`;
    }
    return `${mins}分钟`;
  };

  const getTotalDuration = () => {
    return records.reduce((total, record) => total + (record.duration || 0), 0);
  };

  const renderRecord = (record: TimeRecord) => (
    <View style={styles.shadowDark} key={record.id}>
      <View style={styles.shadowLight}>
        <TouchableOpacity
          onPress={() => router.push('/time-record-form', { id: record.id })}
          onLongPress={() => {
            Toast.show({
              type: 'info',
              text1: '长按选项',
              text2: '再次长按可删除记录',
            });
          }}
          delayLongPress={1000}
        >
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <FontAwesome6 name="clock" size={22} color="#6C63FF" />
            </View>
            <View style={styles.cardContent}>
              <ThemedText style={styles.cardTitle} variant="bodyMedium">
                {record.project || '未分类'}
              </ThemedText>
              <ThemedText style={styles.cardDescription} variant="caption">
                {record.task || '无任务'}
              </ThemedText>
            </View>
            <View style={styles.cardRight}>
              <ThemedText style={styles.durationText} variant="h3">
                {formatDuration(record.duration)}
              </ThemedText>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.dateInfo}>
              <FontAwesome6 name="calendar" size={14} color="#B2BEC3" />
              <ThemedText style={styles.dateText} variant="caption">
                {record.date}
              </ThemedText>
            </View>
            <View style={styles.timeInfo}>
              <FontAwesome6 name="play" size={14} color="#B2BEC3" />
              <ThemedText style={styles.timeText} variant="caption">
                {record.startTime}
              </ThemedText>
              {record.endTime && (
                <>
                  <FontAwesome6 name="stop" size={14} color="#B2BEC3" style={{ marginLeft: 8 }} />
                  <ThemedText style={styles.timeText} variant="caption">
                    {record.endTime}
                  </ThemedText>
                </>
              )}
            </View>
          </View>
          {record.notes && (
            <View style={styles.notesSection}>
              <ThemedText style={styles.notesText} variant="caption">
                {record.notes}
              </ThemedText>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle} variant="h2">
          工作时间记录
        </ThemedText>
        <ThemedText style={styles.headerSubtitle} variant="caption">
          记录并分析你的工作时间
        </ThemedText>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.shadowDark}>
          <View style={styles.shadowLight}>
            <ThemedText style={styles.statsLabel} variant="caption">
              本月总时长
            </ThemedText>
            <ThemedText style={styles.statsValue} variant="h1">
              {formatDuration(getTotalDuration())}
            </ThemedText>
            <ThemedText style={styles.statsSub} variant="caption">
              {records.length} 条记录
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle} variant="h3">
          最近记录
        </ThemedText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchRecords} />
        }
      >
        {records.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome6 name="clipboard-list" size={48} color="#B2BEC3" />
            <ThemedText style={styles.emptyText} variant="bodyMedium">
              暂无记录
            </ThemedText>
            <ThemedText style={styles.emptySub} variant="caption">
              点击右下角按钮添加第一条记录
            </ThemedText>
          </View>
        ) : (
          records.map(renderRecord)
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/time-record-form')}
        activeOpacity={0.9}
      >
        <FontAwesome6 name="plus" size={26} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.exportButton}
        onPress={() => router.push('/analysis')}
        activeOpacity={0.9}
      >
        <FontAwesome6 name="chart-pie" size={22} color="#6C63FF" />
        <ThemedText style={styles.exportButtonText} variant="smallMedium" color="#6C63FF">
          AI 分析
        </ThemedText>
      </TouchableOpacity>
    </Screen>
  );
}

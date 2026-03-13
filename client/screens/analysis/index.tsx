import React, { useState, useCallback, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';
import Toast from 'react-native-toast-message';
// import RNSSE from 'react-native-sse'; // 暂时注释，等待修复模块解析问题

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

export default function AnalysisScreen() {
  const router = useSafeRouter();
  const styles = useMemo(() => createStyles(), []);

  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisContent, setAnalysisContent] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  const fetchRecords = useCallback(async () => {
    try {
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
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/analyze/results`);
      const json = await response.json();

      if (json.error) {
        console.error('Error fetching history:', json.error);
        return;
      }

      setHistory(json.data || []);
    } catch (error: any) {
      console.error('Error fetching history:', error);
    }
  }, []);

  React.useEffect(() => {
    fetchRecords();
    fetchHistory();
  }, [fetchRecords, fetchHistory]);

  const handleAnalyze = async () => {
    if (records.length === 0) {
      Toast.show({
        type: 'error',
        text1: '无数据',
        text2: '请先添加工作时间记录',
      });
      return;
    }

    try {
      setAnalyzing(true);
      setAnalysisContent('');

      const url = `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/analyze`;
      
      // 暂时使用普通 fetch（非流式），等待 react-native-sse 模块解析问题修复
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records }),
      });

      if (!response.ok) {
        throw new Error('分析请求失败');
      }

      // 暂时不处理流式响应，直接完成
      setAnalysisContent('分析功能正在维护中，请稍后重试。');
      setAnalyzing(false);
      fetchHistory();
      
      /* 
      // SSE 流式实现（等待模块解析问题修复后启用）
      const sse = new RNSSE(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records }),
      });

      sse.addEventListener('message', (event: any) => {
        if (event.data === '[DONE]') {
          sse.close();
          setAnalyzing(false);
          fetchHistory();
          return;
        }

        try {
          const data = JSON.parse(event.data);
          if (data.content) {
            setAnalysisContent(prev => prev + data.content);
          }
          if (data.error) {
            Toast.show({
              type: 'error',
              text1: '分析失败',
              text2: data.error,
            });
            setAnalyzing(false);
            sse.close();
          }
        } catch (e) {
          console.error('Error parsing SSE message:', e);
        }
      });

      sse.addEventListener('error', (error: any) => {
        console.error('SSE Error:', error);
        Toast.show({
          type: 'error',
          text1: '分析失败',
          text2: '网络错误',
        });
        setAnalyzing(false);
        sse.close();
      });
      */
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: '分析失败',
        text2: error.message,
      });
      setAnalyzing(false);
    }
  };

  const handleViewHistory = async (result: any) => {
    try {
      setAnalysisContent(result.analysis_content);
      Toast.show({
        type: 'success',
        text1: '加载成功',
        text2: '已加载历史分析结果',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: '加载失败',
        text2: error.message,
      });
    }
  };

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="arrow-left" size={22} color="#6C63FF" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle} variant="h3">
          AI 分析
        </ThemedText>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.shadowDark}>
          <View style={styles.shadowLight}>
            <View style={styles.statsHeader}>
              <View style={styles.statsIconContainer}>
                <FontAwesome6 name="database" size={22} color="#6C63FF" />
              </View>
              <View style={styles.statsContent}>
                <ThemedText style={styles.statsLabel} variant="caption">
                  数据记录
                </ThemedText>
                <ThemedText style={styles.statsValue} variant="h2">
                  {records.length} 条
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={handleAnalyze}
              activeOpacity={0.9}
              disabled={analyzing || records.length === 0}
            >
              {analyzing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <FontAwesome6 name="wand-magic-sparkles" size={18} color="#FFFFFF" />
                  <ThemedText style={styles.analyzeButtonText} variant="smallMedium">
                    开始分析
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {history.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle} variant="h3">
              历史分析
            </ThemedText>
          </View>
          <View>
            <ScrollView
              horizontal
              style={styles.historyScroll}
              contentContainerStyle={styles.historyScrollContent}
            >
            {history.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                style={styles.historyItem}
                onPress={() => handleViewHistory(item)}
                activeOpacity={0.7}
              >
                <FontAwesome6 name="file-lines" size={20} color="#6C63FF" />
                <ThemedText style={styles.historyDate} variant="caption">
                  {new Date(item.created_at).toLocaleDateString('zh-CN')}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        </>
      )}

      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle} variant="h3">
          分析结果
        </ThemedText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {analyzing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6C63FF" />
            <ThemedText style={styles.loadingText} variant="bodyMedium">
              AI 正在分析中...
            </ThemedText>
          </View>
        )}

        {analysisContent && !analyzing && (
          <View style={styles.shadowDark}>
            <View style={styles.shadowLight}>
              <ThemedText style={styles.analysisContent} variant="bodyMedium">
                {analysisContent}
              </ThemedText>
            </View>
          </View>
        )}

        {!analyzing && !analysisContent && (
          <View style={styles.emptyContainer}>
            <FontAwesome6 name="chart-pie" size={48} color="#B2BEC3" />
            <ThemedText style={styles.emptyText} variant="bodyMedium">
              暂无分析结果
            </ThemedText>
            <ThemedText style={styles.emptySub} variant="caption">
              点击&ldquo;开始分析&rdquo;按钮，AI 将为你分析工作时间数据
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

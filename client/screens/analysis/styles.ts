import { StyleSheet } from 'react-native';

export const createStyles = () => {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 16,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      flex: 1,
      fontSize: 20,
      fontWeight: '700',
      color: '#2D3436',
      marginLeft: 8,
    },
    headerRight: {
      width: 38,
    },
    statsContainer: {
      paddingHorizontal: 24,
      marginBottom: 20,
    },
    shadowDark: {
      shadowColor: '#D1D9E6',
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.7,
      shadowRadius: 8,
      borderRadius: 24,
      marginBottom: 16,
    },
    shadowLight: {
      shadowColor: '#FFFFFF',
      shadowOffset: { width: -6, height: -6 },
      shadowOpacity: 0.9,
      shadowRadius: 8,
      backgroundColor: '#F0F0F3',
      borderRadius: 24,
      padding: 20,
    },
    statsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    statsIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(108,99,255,0.12)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    statsContent: {
      marginLeft: 14,
      flex: 1,
    },
    statsLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#636E72',
    },
    statsValue: {
      fontSize: 24,
      fontWeight: '800',
      color: '#6C63FF',
      marginTop: 4,
    },
    analyzeButton: {
      backgroundColor: '#6C63FF',
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      shadowColor: '#6C63FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
    },
    analyzeButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
      marginLeft: 8,
    },
    sectionHeader: {
      paddingHorizontal: 24,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#2D3436',
    },
    historyScroll: {
      paddingHorizontal: 24,
      marginBottom: 16,
    },
    historyScrollContent: {
      paddingRight: 12,
    },
    historyItem: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      marginRight: 12,
      alignItems: 'center',
      minWidth: 100,
      shadowColor: '#D1D9E6',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    historyDate: {
      fontSize: 12,
      color: '#636E72',
      marginTop: 8,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    analysisContent: {
      fontSize: 15,
      color: '#2D3436',
      lineHeight: 22,
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    loadingText: {
      fontSize: 16,
      color: '#636E72',
      marginTop: 16,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#636E72',
      marginTop: 16,
    },
    emptySub: {
      fontSize: 14,
      color: '#B2BEC3',
      marginTop: 8,
      textAlign: 'center',
    },
  });
};

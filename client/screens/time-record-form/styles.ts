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
      padding: 8,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingBottom: 120,
    },
    sectionTitle: {
      marginTop: 20,
      marginBottom: 12,
    },
    sectionTitleText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#2D3436',
    },
    inputContainer: {
      marginBottom: 16,
    },
    inputWrapper: {
      backgroundColor: '#E8E8EB',
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.6)',
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      marginLeft: 12,
      fontSize: 15,
      color: '#2D3436',
    },
    inputMultiline: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#F0F0F3',
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 32,
    },
    saveButton: {
      backgroundColor: '#6C63FF',
      borderRadius: 24,
      paddingVertical: 16,
      alignItems: 'center',
      shadowColor: '#6C63FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 8,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });
};

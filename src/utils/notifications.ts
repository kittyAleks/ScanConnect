import { useEventsStore } from '../store/eventsStore';
import Toast from 'react-native-toast-message';

export const sendPushNotification = async (title: string, message: string) => {
  const { logEvent } = useEventsStore.getState();

  logEvent('Push notification sent', {
    title,
    message,
    timestamp: Date.now(),
  });

  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 3000,
  });
};

import { Alert } from 'react-native';
import { AppNotification } from '../types/notification';
import { notificationService } from './notificationService';
import { TabKey } from '../components/BottomNav';

export interface NotificationNavigationContext {
  navigateTab: (tab: TabKey) => void;
  onOpenDoctorAppointment?: (appointmentId: string) => void;
  onOpenNannyBooking?: (bookingId: string) => void;
  onOpenOrder?: (orderNumber: string) => void;
  onOpenAnnouncement?: (slug: string) => void;
}

class NotificationRouter {
  public handleNotificationPress(
    notification: AppNotification,
    context: NotificationNavigationContext,
  ): boolean {
    // 1. Automatically mark as read on tap
    notificationService.markAsRead(notification.id);

    const { category, actionRoute, actionParams, relatedEntityId } = notification;

    try {
      // 2. Route based on category and destination
      switch (category) {
        case 'DOCTOR': {
          context.navigateTab('doctors');
          if (actionParams?.appointmentId || relatedEntityId) {
            const id = actionParams?.appointmentId || relatedEntityId;
            if (context.onOpenDoctorAppointment) {
              context.onOpenDoctorAppointment(id);
            }
          }
          return true;
        }

        case 'NANNY': {
          context.navigateTab('nanny');
          if (actionParams?.bookingId || relatedEntityId) {
            const id = actionParams?.bookingId || relatedEntityId;
            if (context.onOpenNannyBooking) {
              context.onOpenNannyBooking(id);
            }
          }
          return true;
        }

        case 'ORDER': {
          context.navigateTab('orders');
          if (actionParams?.orderNumber || relatedEntityId) {
            const id = actionParams?.orderNumber || relatedEntityId;
            if (context.onOpenOrder) {
              context.onOpenOrder(id);
            }
          }
          return true;
        }

        case 'APPUGE': {
          if (actionRoute === 'doctors') {
            context.navigateTab('doctors');
          } else {
            context.navigateTab('home');
          }
          if (actionParams?.slug && context.onOpenAnnouncement) {
            context.onOpenAnnouncement(actionParams.slug);
          }
          return true;
        }

        default: {
          context.navigateTab('home');
          return true;
        }
      }
    } catch (err) {
      console.warn('[NotificationRouter] Navigation error:', err);
      Alert.alert(
        'Update Notice',
        'This record may have been updated or completed. You have been directed to the relevant care section.',
      );
      context.navigateTab('home');
      return false;
    }
  }
}

export const notificationRouter = new NotificationRouter();

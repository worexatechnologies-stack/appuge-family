import {
  AppNotification,
  NotificationCategory,
  NotificationFilter,
  NotificationDateGroup,
  NotificationPreferences,
  PushRegistrationState,
} from '../types/notification';

const INITIAL_PREFERENCES: NotificationPreferences = {
  pushNotificationsEnabled: true,
  permissionStatus: 'granted',
  doctor: {
    confirmations: true,
    reminders: true,
    reschedulingAndCancellations: true,
    consultationUpdates: true,
  },
  nanny: {
    requestsAndResponses: true,
    confirmations: true,
    sessionReminders: true,
    bookingUpdates: true,
  },
  shopping: {
    orderUpdates: true,
    shippingAndDelivery: true,
    refundUpdates: true,
  },
  appuge: {
    importantAnnouncements: true,
    offersAndPromotions: false,
    productNews: true,
  },
};

// Seed realistic, authoritative notifications across all 4 Appuge domains
const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-doc-1',
    userId: 'usr-default',
    title: 'Appointment Confirmed',
    body: 'Dr. Radhika Menon has confirmed your unhurried consultation for tomorrow at 10:00 AM at the Indiranagar Sanctuary.',
    category: 'DOCTOR',
    eventType: 'APPOINTMENT_CONFIRMED',
    relatedEntityId: 'APG-DOC-9821',
    relatedEntityType: 'doctor_appointment',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago (Today)
    isRead: false,
    priority: 'HIGH',
    actionRoute: 'doctors',
    actionParams: { appointmentId: 'APG-DOC-9821' },
    deliveryStatus: 'delivered',
    ctaLabel: 'View Appointment Details →',
  },
  {
    id: 'notif-nan-1',
    userId: 'usr-default',
    title: 'Nanny Booking Confirmed',
    body: 'Lakshmi Devi has confirmed your managed childcare booking for tomorrow, 9:00 AM to 5:00 PM.',
    category: 'NANNY',
    eventType: 'NANNY_CONFIRMED',
    relatedEntityId: 'BK-APG-9021',
    relatedEntityType: 'nanny_booking',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago (Today)
    isRead: false,
    priority: 'HIGH',
    actionRoute: 'nanny',
    actionParams: { bookingId: 'BK-APG-9021' },
    deliveryStatus: 'delivered',
    ctaLabel: 'View Nanny Booking →',
  },
  {
    id: 'notif-ord-1',
    userId: 'usr-default',
    title: 'Order Dispatched & In Transit',
    body: 'Order OD-APG98421B (Nourishing Baby Massage Oil & Galactagogue Ladoos) has been handed to our express Bengaluru delivery fleet.',
    category: 'ORDER',
    eventType: 'ORDER_SHIPPED',
    relatedEntityId: 'OD-APG98421B',
    relatedEntityType: 'commerce_order',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago (Today)
    isRead: false,
    priority: 'NORMAL',
    actionRoute: 'orders',
    actionParams: { orderNumber: 'OD-APG98421B' },
    deliveryStatus: 'delivered',
    ctaLabel: 'Track Delivery →',
  },
  {
    id: 'notif-doc-2',
    userId: 'usr-default',
    title: 'Unhurried Care Reminder',
    body: 'Your newborn milestone review with Dr. Radhika Menon is approaching. Feel free to list questions in advance.',
    category: 'DOCTOR',
    eventType: 'APPOINTMENT_REMINDER',
    relatedEntityId: 'APG-DOC-9821',
    relatedEntityType: 'doctor_appointment',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 26 hours ago (Yesterday)
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    isRead: true,
    priority: 'NORMAL',
    actionRoute: 'doctors',
    actionParams: { appointmentId: 'APG-DOC-9821' },
    deliveryStatus: 'delivered',
    ctaLabel: 'Prepare Questions →',
  },
  {
    id: 'notif-nan-2',
    userId: 'usr-default',
    title: 'Appuge Verification Verified',
    body: 'Your selected caregiver Lakshmi Devi has completed updated KMC pediatric first-aid verification renewal.',
    category: 'NANNY',
    eventType: 'NANNY_SUPPORT_UPDATE',
    relatedEntityId: 'BK-APG-9021',
    relatedEntityType: 'nanny_booking',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago (Earlier this week)
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    isRead: true,
    priority: 'LOW',
    actionRoute: 'nanny',
    actionParams: { bookingId: 'BK-APG-9021' },
    deliveryStatus: 'delivered',
    ctaLabel: 'View Credentials →',
  },
  {
    id: 'notif-ord-2',
    userId: 'usr-default',
    title: 'Payment Confirmed & Preparing',
    body: 'We have received payment of ₹1,329 for Order OD-APG98421B. Handcrafted kitchen items are being freshly packed.',
    category: 'ORDER',
    eventType: 'PAYMENT_UPDATED',
    relatedEntityId: 'OD-APG98421B',
    relatedEntityType: 'commerce_order',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago (Earlier this week)
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
    isRead: true,
    priority: 'NORMAL',
    actionRoute: 'orders',
    actionParams: { orderNumber: 'OD-APG98421B' },
    deliveryStatus: 'delivered',
    ctaLabel: 'View Receipt →',
  },
  {
    id: 'notif-app-1',
    userId: 'usr-default',
    title: 'Monsoon Infant Skin Care Guide',
    body: 'Pediatric Dermatologist Dr. Kavita Kulkarni shares gentle bathing rituals for delicate newborn skin in cool Bengaluru air.',
    category: 'APPUGE',
    eventType: 'WELLNESS_GUIDE',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago (Earlier this week)
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 100).toISOString(),
    isRead: true,
    priority: 'LOW',
    actionRoute: 'doctors',
    actionParams: { specialityId: 'peds-derma' },
    deliveryStatus: 'delivered',
    ctaLabel: 'Read Guide →',
  },
  {
    id: 'notif-app-2',
    userId: 'usr-default',
    title: 'Welcome to Appuge Care',
    body: 'Heartbeats Wrapped With Love. Your sanctuary for doctors, managed childcare and maternal wellness.',
    category: 'APPUGE',
    eventType: 'PLATFORM_ANNOUNCEMENT',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(), // 10 days ago (Older)
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 200).toISOString(),
    isRead: true,
    priority: 'LOW',
    actionRoute: 'home',
    deliveryStatus: 'delivered',
    ctaLabel: 'Explore Sanctuary →',
  },
];

class NotificationService {
  private notifications: AppNotification[] = [...INITIAL_NOTIFICATIONS];
  private preferences: NotificationPreferences = { ...INITIAL_PREFERENCES };
  private pushState: PushRegistrationState = {
    token: 'demo-fcm-token-appuge-xyz8892',
    registeredAt: new Date().toISOString(),
    provider: 'demo',
    isDeviceRegistered: true,
  };
  private listeners: Set<() => void> = new Set();

  private notify() {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.warn('[NotificationService] listener error:', err);
      }
    });
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getNotifications(userId?: string): AppNotification[] {
    if (!userId) return [...this.notifications];
    return this.notifications.filter(
      n => n.userId === userId || n.userId === 'usr-default',
    );
  }

  public getFilteredNotifications(
    filter: NotificationFilter,
    userId?: string,
  ): AppNotification[] {
    const list = this.getNotifications(userId);
    switch (filter) {
      case 'ALL':
        return list;
      case 'UNREAD':
        return list.filter(n => !n.isRead);
      case 'DOCTOR':
        return list.filter(n => n.category === 'DOCTOR');
      case 'NANNY':
        return list.filter(n => n.category === 'NANNY');
      case 'ORDER':
        return list.filter(n => n.category === 'ORDER');
      case 'APPUGE':
        return list.filter(n => n.category === 'APPUGE');
      default:
        return list;
    }
  }

  public getUnreadCount(userId?: string): number {
    return this.getNotifications(userId).filter(n => !n.isRead).length;
  }

  public markAsRead(id: string): void {
    let changed = false;
    this.notifications = this.notifications.map(n => {
      if (n.id === id && !n.isRead) {
        changed = true;
        return {
          ...n,
          isRead: true,
          readAt: new Date().toISOString(),
        };
      }
      return n;
    });
    if (changed) {
      this.notify();
    }
  }

  public markAsUnread(id: string): void {
    let changed = false;
    this.notifications = this.notifications.map(n => {
      if (n.id === id && n.isRead) {
        changed = true;
        return {
          ...n,
          isRead: false,
          readAt: null,
        };
      }
      return n;
    });
    if (changed) {
      this.notify();
    }
  }

  public markAllAsRead(userId?: string): void {
    let changed = false;
    this.notifications = this.notifications.map(n => {
      if (!n.isRead && (!userId || n.userId === userId || n.userId === 'usr-default')) {
        changed = true;
        return {
          ...n,
          isRead: true,
          readAt: new Date().toISOString(),
        };
      }
      return n;
    });
    if (changed) {
      this.notify();
    }
  }

  public dismissNotification(id: string): void {
    const initialLen = this.notifications.length;
    this.notifications = this.notifications.filter(n => n.id !== id);
    if (this.notifications.length !== initialLen) {
      this.notify();
    }
  }

  public clearAll(userId?: string): void {
    if (!userId) {
      this.notifications = [];
    } else {
      this.notifications = this.notifications.filter(
        n => n.userId !== userId && n.userId !== 'usr-default',
      );
    }
    this.notify();
  }

  public addNotification(
    item: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'> & {
      id?: string;
      createdAt?: string;
      isRead?: boolean;
      deliveryStatus?: 'delivered' | 'pending' | 'failed';
    },
  ): AppNotification {
    const newNotif: AppNotification = {
      id: item.id || `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: item.createdAt || new Date().toISOString(),
      isRead: item.isRead ?? false,
      ...item,
      deliveryStatus: item.deliveryStatus || 'delivered',
    };

    // Avoid duplicate event notification for same related entity and event type
    const exists = this.notifications.some(
      n =>
        n.relatedEntityId === newNotif.relatedEntityId &&
        n.eventType === newNotif.eventType &&
        n.createdAt === newNotif.createdAt,
    );

    if (!exists) {
      this.notifications = [newNotif, ...this.notifications];
      this.notify();
    }

    return newNotif;
  }

  public getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  public updatePreferences(
    partial: Partial<NotificationPreferences>,
  ): NotificationPreferences {
    this.preferences = {
      ...this.preferences,
      ...partial,
      doctor: {
        ...this.preferences.doctor,
        ...(partial.doctor || {}),
      },
      nanny: {
        ...this.preferences.nanny,
        ...(partial.nanny || {}),
      },
      shopping: {
        ...this.preferences.shopping,
        ...(partial.shopping || {}),
      },
      appuge: {
        ...this.preferences.appuge,
        ...(partial.appuge || {}),
      },
    };
    this.notify();
    return this.getPreferences();
  }

  public getPushRegistrationState(): PushRegistrationState {
    return { ...this.pushState };
  }

  public async requestPushPermission(): Promise<'granted' | 'denied'> {
    // In React Native CLI without native FCM library installed, simulates permission prompt
    // and updates internal state. Ready to plug into Firebase/Notifee.
    this.preferences.permissionStatus = 'granted';
    this.preferences.pushNotificationsEnabled = true;
    this.pushState.isDeviceRegistered = true;
    this.notify();
    return 'granted';
  }

  public async registerPushToken(token: string): Promise<boolean> {
    this.pushState = {
      token,
      registeredAt: new Date().toISOString(),
      provider: 'demo',
      isDeviceRegistered: true,
    };
    this.notify();
    return true;
  }

  public async unregisterPushToken(): Promise<void> {
    this.pushState = {
      token: null,
      registeredAt: null,
      provider: 'demo',
      isDeviceRegistered: false,
    };
    this.notify();
  }

  public resetToInitial(): void {
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.preferences = { ...INITIAL_PREFERENCES };
    this.notify();
  }
}

export const notificationService = new NotificationService();

/**
 * Group notifications chronologically into:
 * - Today
 * - Yesterday
 * - Earlier this week
 * - Older
 */
export function groupNotificationsByDate(
  list: AppNotification[],
): Record<NotificationDateGroup, AppNotification[]> {
  const result: Record<NotificationDateGroup, AppNotification[]> = {
    Today: [],
    Yesterday: [],
    'Earlier this week': [],
    Older: [],
  };

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const startOfYesterday = startOfToday - 86400000;
  const startOfWeek = startOfToday - 86400000 * 6;

  list.forEach(item => {
    const time = new Date(item.createdAt).getTime();
    if (time >= startOfToday) {
      result.Today.push(item);
    } else if (time >= startOfYesterday) {
      result.Yesterday.push(item);
    } else if (time >= startOfWeek) {
      result['Earlier this week'].push(item);
    } else {
      result.Older.push(item);
    }
  });

  return result;
}

/**
 * Relative time formatter for Appuge luxury editorial UX
 */
export function formatNotificationTime(isoString: string): string {
  try {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 2) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;

    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recent';
  }
}

export type NotificationCategory = 'DOCTOR' | 'NANNY' | 'ORDER' | 'APPUGE';

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type DoctorEventType =
  | 'APPOINTMENT_REQUESTED'
  | 'APPOINTMENT_ACCEPTED'
  | 'APPOINTMENT_CONFIRMED'
  | 'APPOINTMENT_REMINDER'
  | 'CONSULTATION_APPROACHING'
  | 'APPOINTMENT_RESCHEDULED'
  | 'APPOINTMENT_CANCELLED'
  | 'DOCTOR_DECLINED'
  | 'CONSULTATION_COMPLETED'
  | 'FEEDBACK_REQUESTED';

export type NannyEventType =
  | 'NANNY_REQUEST_RECEIVED'
  | 'NANNY_UNDER_REVIEW'
  | 'NANNY_ACCEPTED'
  | 'NANNY_CONFIRMED'
  | 'NANNY_SESSION_REMINDER'
  | 'NANNY_SESSION_STARTED'
  | 'NANNY_SESSION_COMPLETED'
  | 'NANNY_DECLINED'
  | 'NANNY_CANCELLED'
  | 'NANNY_SUPPORT_UPDATE';

export type OrderEventType =
  | 'ORDER_PLACED'
  | 'PAYMENT_UPDATED'
  | 'ORDER_PROCESSING'
  | 'ORDER_SHIPPED'
  | 'DELIVERY_STATUS_UPDATED'
  | 'ORDER_DELIVERED'
  | 'ORDER_CANCELLED'
  | 'REFUND_UPDATED';

export type AppugeEventType =
  | 'PLATFORM_ANNOUNCEMENT'
  | 'POLICY_UPDATE'
  | 'GENUINE_OFFER'
  | 'PRODUCT_ANNOUNCEMENT'
  | 'SERVICE_UPDATE'
  | 'WELLNESS_GUIDE';

export type NotificationEventType =
  | DoctorEventType
  | NannyEventType
  | OrderEventType
  | AppugeEventType;

export type RelatedEntityType =
  | 'doctor_appointment'
  | 'nanny_booking'
  | 'commerce_order'
  | 'announcement';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: NotificationCategory;
  eventType: NotificationEventType;
  relatedEntityId?: string;
  relatedEntityType?: RelatedEntityType;
  createdAt: string; // ISO 8601 string
  readAt?: string | null;
  isRead: boolean;
  priority: NotificationPriority;
  actionRoute?: string;
  actionParams?: Record<string, any>;
  deliveryStatus?: 'delivered' | 'pending' | 'failed';
  ctaLabel?: string;
}

export type NotificationFilter =
  | 'ALL'
  | 'UNREAD'
  | 'DOCTOR'
  | 'NANNY'
  | 'ORDER'
  | 'APPUGE';

export type NotificationDateGroup =
  | 'Today'
  | 'Yesterday'
  | 'Earlier this week'
  | 'Older';

export interface DoctorPreferences {
  confirmations: boolean;
  reminders: boolean;
  reschedulingAndCancellations: boolean;
  consultationUpdates: boolean;
}

export interface NannyPreferences {
  requestsAndResponses: boolean;
  confirmations: boolean;
  sessionReminders: boolean;
  bookingUpdates: boolean;
}

export interface ShoppingPreferences {
  orderUpdates: boolean;
  shippingAndDelivery: boolean;
  refundUpdates: boolean;
}

export interface AppugeUpdatesPreferences {
  importantAnnouncements: boolean; // Transational / vital
  offersAndPromotions: boolean;    // Marketing
  productNews: boolean;            // Marketing
}

export interface NotificationPreferences {
  pushNotificationsEnabled: boolean;
  permissionStatus: 'granted' | 'denied' | 'not_determined' | 'provisional';
  doctor: DoctorPreferences;
  nanny: NannyPreferences;
  shopping: ShoppingPreferences;
  appuge: AppugeUpdatesPreferences;
}

export interface PushRegistrationState {
  token: string | null;
  registeredAt: string | null;
  provider: 'fcm' | 'notifee' | 'demo';
  isDeviceRegistered: boolean;
}

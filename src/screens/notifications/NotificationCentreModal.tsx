import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Colors, Fonts } from '../../theme/colors';
import { AppIcon } from '../../components/common/AppIcon';
import {
  AppNotification,
  NotificationFilter,
  NotificationCategory,
  NotificationPriority,
} from '../../types/notification';
import {
  notificationService,
  groupNotificationsByDate,
  formatNotificationTime,
} from '../../services/notificationService';
import {
  notificationRouter,
  NotificationNavigationContext,
} from '../../services/notificationRouter';

interface NotificationCentreModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  navigationContext: NotificationNavigationContext;
}

export const NotificationCentreModal: React.FC<NotificationCentreModalProps> = ({
  visible,
  onClose,
  onOpenSettings,
  navigationContext,
}) => {
  const [filter, setFilter] = useState<NotificationFilter>('ALL');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Sync with service
  const refresh = useCallback(() => {
    setNotifications(notificationService.getNotifications());
    setUnreadCount(notificationService.getUnreadCount());
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = notificationService.subscribe(refresh);
    return () => unsubscribe();
  }, [refresh]);

  // Filtered notifications
  const filteredList = useMemo(() => {
    return notificationService.getFilteredNotifications(filter);
  }, [filter, notifications]);

  // Group by date
  const grouped = useMemo(() => {
    return groupNotificationsByDate(filteredList);
  }, [filteredList]);

  // Category counts for filter pills
  const counts = useMemo(() => {
    const all = notifications.length;
    const unread = notifications.filter(n => !n.isRead).length;
    const doctor = notifications.filter(n => n.category === 'DOCTOR').length;
    const nanny = notifications.filter(n => n.category === 'NANNY').length;
    const order = notifications.filter(n => n.category === 'ORDER').length;
    const appuge = notifications.filter(n => n.category === 'APPUGE').length;
    return { all, unread, doctor, nanny, order, appuge };
  }, [notifications]);

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
  };

  const handleNotificationPress = (notif: AppNotification) => {
    onClose();
    notificationRouter.handleNotificationPress(notif, navigationContext);
  };

  const handleToggleReadStatus = (notif: AppNotification) => {
    if (notif.isRead) {
      notificationService.markAsUnread(notif.id);
    } else {
      notificationService.markAsRead(notif.id);
    }
  };

  const handleDismiss = (notif: AppNotification) => {
    Alert.alert(
      'Dismiss Update',
      'Are you sure you want to dismiss this notification from your inbox?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Dismiss',
          style: 'destructive',
          onPress: () => notificationService.dismissNotification(notif.id),
        },
      ],
    );
  };

  // Helper for category styling
  const getCategoryMeta = (category: NotificationCategory) => {
    switch (category) {
      case 'DOCTOR':
        return {
          icon: 'stethoscope',
          label: 'Doctor Care',
          color: Colors.forestDark,
          bg: '#EAF2EC',
        };
      case 'NANNY':
        return {
          icon: 'baby',
          label: 'Nanny Care',
          color: Colors.terracotta,
          bg: '#FDF1EC',
        };
      case 'ORDER':
        return {
          icon: 'delivery',
          label: 'Order Update',
          color: Colors.sage,
          bg: '#EAF0EB',
        };
      case 'APPUGE':
        return {
          icon: 'sparkle',
          label: 'Appuge Sanctuary',
          color: Colors.goldWarm,
          bg: '#FFF8EE',
        };
    }
  };

  const getPriorityBadge = (priority: NotificationPriority) => {
    if (priority === 'URGENT') {
      return (
        <View style={[styles.priorityBadge, { backgroundColor: '#FDECEB' }]}>
          <Text style={[styles.priorityBadgeText, { color: '#C62828' }]}>
            URGENT
          </Text>
        </View>
      );
    }
    if (priority === 'HIGH') {
      return (
        <View style={[styles.priorityBadge, { backgroundColor: '#FFF4E5' }]}>
          <Text style={[styles.priorityBadgeText, { color: '#E65100' }]}>
            IMPORTANT
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderEmptyState = () => {
    let title = 'All caught up.';
    let desc = "When something important happens, you'll find it here.";

    if (filter === 'UNREAD') {
      title = 'No unread updates';
      desc = 'You have read all recent updates from doctors, nannies, and orders.';
    } else if (filter === 'DOCTOR') {
      title = 'No doctor updates';
      desc = 'Your appointment requests, confirmations, and consultation notes will appear here.';
    } else if (filter === 'NANNY') {
      title = 'No childcare updates';
      desc = 'Your nanny booking confirmations, session arrival reminders, and care updates will appear here.';
    } else if (filter === 'ORDER') {
      title = 'No order updates';
      desc = 'Delivery and preparation tracking for your physical wellness orders will appear here.';
    } else if (filter === 'APPUGE') {
      title = 'No platform announcements';
      desc = 'New clinical guides, pediatric wellness tips, and sanctuary updates will appear here.';
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <AppIcon name="bell" size={26} color={Colors.sage} />
        </View>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptyDesc}>{desc}</Text>

        {filter !== 'ALL' && (
          <TouchableOpacity
            style={styles.emptyActionBtn}
            activeOpacity={0.85}
            onPress={() => setFilter('ALL')}>
            <Text style={styles.emptyActionBtnText}>View All Updates</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const hasAnyItems = filteredList.length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}>
      <View style={styles.root}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.backBtn}
              activeOpacity={0.7}
              accessibilityLabel="Back to app">
              <AppIcon name="close" size={16} color={Colors.forestDark} />
            </TouchableOpacity>

            <View style={styles.headerActions}>
              {unreadCount > 0 && (
                <TouchableOpacity
                  onPress={handleMarkAllRead}
                  style={styles.markReadBtn}
                  activeOpacity={0.7}
                  accessibilityLabel="Mark all as read">
                  <AppIcon name="check" size={12} color={Colors.sageDark} />
                  <Text style={styles.markReadText}>Mark all read</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={onOpenSettings}
                style={styles.settingsBtn}
                activeOpacity={0.7}
                accessibilityLabel="Notification settings">
                <AppIcon name="shield" size={15} color={Colors.forestDark} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.headerTitles}>
            <View style={styles.titleRow}>
              <Text style={styles.headerTitle}>Your updates</Text>
              {unreadCount > 0 && (
                <View style={styles.unreadCountPill}>
                  <Text style={styles.unreadCountPillText}>
                    {unreadCount} new
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.headerSubtitle}>
              Everything important, all in one place.
            </Text>
          </View>

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}>
            <TouchableOpacity
              style={[
                styles.filterPill,
                filter === 'ALL' && styles.filterPillActive,
              ]}
              onPress={() => setFilter('ALL')}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.filterPillText,
                  filter === 'ALL' && styles.filterPillTextActive,
                ]}>
                All {counts.all > 0 ? `(${counts.all})` : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                filter === 'UNREAD' && styles.filterPillActive,
              ]}
              onPress={() => setFilter('UNREAD')}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.filterPillText,
                  filter === 'UNREAD' && styles.filterPillTextActive,
                ]}>
                Unread {counts.unread > 0 ? `(${counts.unread})` : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                filter === 'DOCTOR' && styles.filterPillActive,
              ]}
              onPress={() => setFilter('DOCTOR')}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.filterPillText,
                  filter === 'DOCTOR' && styles.filterPillTextActive,
                ]}>
                Doctors {counts.doctor > 0 ? `(${counts.doctor})` : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                filter === 'NANNY' && styles.filterPillActive,
              ]}
              onPress={() => setFilter('NANNY')}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.filterPillText,
                  filter === 'NANNY' && styles.filterPillTextActive,
                ]}>
                Nanny {counts.nanny > 0 ? `(${counts.nanny})` : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                filter === 'ORDER' && styles.filterPillActive,
              ]}
              onPress={() => setFilter('ORDER')}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.filterPillText,
                  filter === 'ORDER' && styles.filterPillTextActive,
                ]}>
                Orders {counts.order > 0 ? `(${counts.order})` : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                filter === 'APPUGE' && styles.filterPillActive,
              ]}
              onPress={() => setFilter('APPUGE')}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.filterPillText,
                  filter === 'APPUGE' && styles.filterPillTextActive,
                ]}>
                Appuge Updates {counts.appuge > 0 ? `(${counts.appuge})` : ''}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Notification List or Empty State */}
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}>
          {!hasAnyItems ? (
            renderEmptyState()
          ) : (
            <>
              {(
                ['Today', 'Yesterday', 'Earlier this week', 'Older'] as const
              ).map(groupName => {
                const groupItems = grouped[groupName];
                if (!groupItems || groupItems.length === 0) return null;

                return (
                  <View key={groupName} style={styles.dateGroup}>
                    <View style={styles.dateHeaderRow}>
                      <Text style={styles.dateHeaderText}>{groupName}</Text>
                      <View style={styles.dateHeaderLine} />
                    </View>

                    {groupItems.map(item => {
                      const meta = getCategoryMeta(item.category);
                      const priorityBadge = getPriorityBadge(item.priority);

                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.notifCard,
                            !item.isRead && styles.notifCardUnread,
                          ]}
                          onPress={() => handleNotificationPress(item)}
                          activeOpacity={0.88}>
                          {/* Unread Accent Bar */}
                          {!item.isRead && (
                            <View style={styles.unreadIndicatorDot} />
                          )}

                          <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                              <View
                                style={[
                                  styles.categoryIconWrap,
                                  { backgroundColor: meta.bg },
                                ]}>
                                <AppIcon
                                  name={meta.icon}
                                  size={13}
                                  color={meta.color}
                                />
                              </View>
                              <Text style={styles.categoryLabel}>
                                {meta.label}
                              </Text>
                            </View>

                            <View style={styles.cardHeaderRight}>
                              {priorityBadge}
                              <Text style={styles.timestampText}>
                                {formatNotificationTime(item.createdAt)}
                              </Text>
                            </View>
                          </View>

                          {/* Body Content */}
                          <View style={styles.cardBody}>
                            <Text
                              style={[
                                styles.notifTitle,
                                !item.isRead && styles.notifTitleUnread,
                              ]}>
                              {item.title}
                            </Text>
                            <Text style={styles.notifBody}>{item.body}</Text>
                          </View>

                          {/* Card Footer: Action CTA & Overflow */}
                          <View style={styles.cardFooter}>
                            <View style={styles.ctaPill}>
                              <Text style={styles.ctaPillText}>
                                {item.ctaLabel || 'View Details →'}
                              </Text>
                            </View>

                            <View style={styles.cardQuickActions}>
                              <TouchableOpacity
                                style={styles.quickActionBtn}
                                onPress={() => handleToggleReadStatus(item)}
                                accessibilityLabel={
                                  item.isRead
                                    ? 'Mark as unread'
                                    : 'Mark as read'
                                }>
                                <Text style={styles.quickActionText}>
                                  {item.isRead
                                    ? 'Mark unread'
                                    : 'Mark read'}
                                </Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={styles.dismissBtn}
                                onPress={() => handleDismiss(item)}
                                accessibilityLabel="Dismiss notification">
                                <AppIcon
                                  name="close"
                                  size={11}
                                  color={Colors.textMuted}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}

              <View style={styles.footerNote}>
                <AppIcon name="shield" size={13} color={Colors.sage} />
                <Text style={styles.footerNoteText}>
                  Appuge Smart Alerts · Scoped securely to your family's care
                  account.
                </Text>
              </View>
            </>
          )}

          <View style={{ height: 60 }} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  header: {
    backgroundColor: Colors.creamLight,
    paddingTop: Platform.OS === 'android' ? 46 : 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(44, 64, 53, 0.08)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFDF9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.1)',
  },
  markReadText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.sageDark,
  },
  settingsBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitles: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 2,
  },
  headerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.forestDark,
    letterSpacing: 0.2,
  },
  unreadCountPill: {
    backgroundColor: Colors.terracotta,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadCountPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFDF9',
    letterSpacing: 0.4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  filterScroll: {
    paddingHorizontal: 18,
    paddingBottom: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.12)',
  },
  filterPillActive: {
    backgroundColor: Colors.forestDark,
    borderColor: Colors.forestDark,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  filterPillTextActive: {
    color: '#FFFDF9',
  },

  // Body Content
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  dateHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  dateHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(44, 64, 53, 0.08)',
  },

  // Notification Card
  notifCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(44, 64, 53, 0.07)',
    position: 'relative',
    shadowColor: '#16281E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  notifCardUnread: {
    backgroundColor: '#FCFAF6',
    borderColor: 'rgba(200, 109, 81, 0.25)',
    borderLeftWidth: 3,
    borderLeftColor: Colors.terracotta,
  },
  unreadIndicatorDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.terracotta,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  categoryIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: Colors.forestDark,
    letterSpacing: 0.3,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 12,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timestampText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  cardBody: {
    marginBottom: 10,
  },
  notifTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.forestDark,
    lineHeight: 18,
    marginBottom: 4,
  },
  notifTitleUnread: {
    fontWeight: '800',
    color: Colors.forestDark,
  },
  notifBody: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(44, 64, 53, 0.05)',
  },
  ctaPill: {
    backgroundColor: Colors.creamLight,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ctaPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  cardQuickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quickActionBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  quickActionText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.sage,
  },
  dismissBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(44, 64, 53, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.sagePale,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.forestDark,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 260,
    marginBottom: 20,
  },
  emptyActionBtn: {
    backgroundColor: Colors.forestDark,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 18,
  },
  emptyActionBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFDF9',
  },

  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    opacity: 0.8,
  },
  footerNoteText: {
    fontSize: 9.5,
    color: Colors.textMuted,
    fontWeight: '600',
  },
});

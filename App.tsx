import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, StatusBar, Alert, BackHandler } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from './src/theme/colors';
import { SplashScreen } from './src/screens/SplashScreen';
import { Header } from './src/components/Header';
import { BottomNav, TabKey } from './src/components/BottomNav';
import { BookingModal, BookingData } from './src/components/BookingModal';
import { ProfileModal } from './src/components/ProfileModal';
import { HomeScreen } from './src/screens/HomeScreen';
import { ShopScreen } from './src/screens/ShopScreen';
import { CartScreen } from './src/screens/CartScreen';
import { OrdersScreen } from './src/screens/OrdersScreen';
import { ServicesScreen } from './src/screens/ServicesScreen';
import { NutritionScreen } from './src/screens/NutritionScreen';
import { DoctorsScreen } from './src/screens/DoctorsScreen';
import { FaqScreen } from './src/screens/FaqScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { CommitmentDetailScreen } from './src/screens/CommitmentDetailScreen';
import { CommitmentDetailId } from './src/data/commitmentDetails';
import {
  COMMERCE_ITEMS,
  CommerceItem,
  CommerceCategory,
  INITIAL_ORDERS,
  CommerceOrder,
  isShopProduct,
} from './src/data/commerceData';
import { ProductDetailModal } from './src/components/ProductDetailModal';
import { SearchModal } from './src/components/SearchModal';
import { LocationModal } from './src/components/LocationModal';
import { FloatingCartBar } from './src/components/FloatingCartBar';
import { WishlistScreen } from './src/screens/WishlistScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { NannyCareHomeScreen } from './src/screens/nanny/NannyCareHomeScreen';
import { NotificationCentreModal } from './src/screens/notifications/NotificationCentreModal';
import { NotificationPreferencesModal } from './src/screens/notifications/NotificationPreferencesModal';
import { notificationService } from './src/services/notificationService';

interface UserProfile {
  name: string;
  phone: string;
  stage?: string;
  location?: string;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentTab, setCurrentTab] = useState<TabKey>('home');
  const [tabHistory, setTabHistory] = useState<TabKey[]>(['home']);
  const [commitmentDetailId, setCommitmentDetailId] =
    useState<CommitmentDetailId | null>(null);
  const [bookingVisible, setBookingVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [notificationCentreVisible, setNotificationCentreVisible] = useState(false);
  const [notificationPreferencesVisible, setNotificationPreferencesVisible] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(
    notificationService.getUnreadCount(),
  );
  const [prefillService, setPrefillService] = useState(
    'Mother & Baby Dual Sanctuary',
  );
  const [userBookings, setUserBookings] = useState<BookingData[]>([]);

  // Authentication State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authScreen, setAuthScreen] = useState<'login' | 'register' | null>(
    null,
  );
  const [pendingBookingService, setPendingBookingService] = useState<
    string | null
  >(null);
  const [authRedirectMessage, setAuthRedirectMessage] = useState<string | null>(
    null,
  );

  // E-Commerce State
  const [cart, setCart] = useState<Record<string, number>>({});
  const [wishlist, setWishlist] = useState<string[]>([
    'baby-massage-oil',
    'galactagogue-ladoos',
  ]);
  const [orders, setOrders] = useState<CommerceOrder[]>(INITIAL_ORDERS);
  const [currentLocality, setCurrentLocality] = useState('Indiranagar');
  const [currentPincode, setCurrentPincode] = useState('560038');
  const [selectedProduct, setSelectedProduct] = useState<CommerceItem | null>(
    null,
  );
  const [searchVisible, setSearchVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);
  const [shopCategory, setShopCategory] = useState<CommerceCategory>('All');

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = COMMERCE_ITEMS.find(i => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  // Sync Unread Notifications
  useEffect(() => {
    setUnreadNotifCount(notificationService.getUnreadCount(user?.phone));
    const unsubscribe = notificationService.subscribe(() => {
      setUnreadNotifCount(notificationService.getUnreadCount(user?.phone));
    });
    return () => unsubscribe();
  }, [user]);

  // E-Commerce Handlers
  const handleAddToCart = (item: CommerceItem) => {
    if (!isShopProduct(item)) return;
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  };

  const handleUpdateQty = (id: string, delta: number) => {
    const item = COMMERCE_ITEMS.find(candidate => candidate.id === id);
    if (!item || !isShopProduct(item)) return;
    setCart(prev => {
      const current = prev[id] || 0;
      const next = current + delta;
      const copy = { ...prev };
      if (next > 0) {
        copy[id] = next;
      } else {
        delete copy[id];
      }
      return copy;
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleToggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const handlePlaceOrder = (summary: {
    items: { item: CommerceItem; quantity: number }[];
    total: number;
    discount: number;
    address: string;
  }) => {
    if (!summary.items.length || summary.items.some(entry => !isShopProduct(entry.item))) {
      Alert.alert('Unable to place order', 'Your basket contains an item unavailable for product checkout.');
      return;
    }
    const newOrder: CommerceOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `OD-APG${Math.floor(10000 + Math.random() * 90000)}B`,
      orderDate: 'Today, Just Now',
      items: summary.items.map(e => ({
        itemId: e.item.id,
        title: e.item.title,
        price: e.item.price,
        quantity: e.quantity,
        image: e.item.image,
        durationOrWeight: e.item.durationOrWeight,
      })),
      totalAmount: summary.total,
      discountAmount: summary.discount,
      status: 'Confirmed',
      statusColor: '#1B5E20',
      deliveryDateText: 'Delivery Expected Tomorrow',
      deliveryAddress: summary.address,
      trackingSteps: [
        {
          title: 'Order Placed & Payment Verified',
          desc: 'UPI / Prepaid transaction confirmed',
          time: 'Just now',
          completed: true,
          active: false,
        },
        {
          title: 'Preparation & Quality Packaging',
          desc: 'Handpicked fresh items assigned to kitchen & store',
          time: 'In Progress',
          completed: false,
          active: true,
        },
        {
          title: 'Dispatched with Fleet Partner',
          desc: 'Bengaluru city express route',
          time: 'Tomorrow 9:00 AM',
          completed: false,
          active: false,
        },
        {
          title: 'Delivered to Doorstep',
          desc: summary.address,
          time: 'Tomorrow 12:00 PM',
          completed: false,
          active: false,
        },
      ],
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart({});

    // Generate real-time authoritative order notification
    notificationService.addNotification({
      userId: user?.phone || 'usr-default',
      title: 'Order Placed & Confirmed',
      body: `Order ${newOrder.orderNumber} for ₹${summary.total.toLocaleString(
        'en-IN',
      )} has been confirmed. Fresh items are being packed in our sanctuary kitchen.`,
      category: 'ORDER',
      eventType: 'ORDER_PLACED',
      relatedEntityId: newOrder.orderNumber,
      relatedEntityType: 'commerce_order',
      priority: 'NORMAL',
      actionRoute: 'orders',
      actionParams: { orderNumber: newOrder.orderNumber },
      ctaLabel: 'Track Delivery →',
    });

    Alert.alert(
      '🎉 Order Placed Successfully!',
      `Order ${newOrder.orderNumber} for ₹${summary.total.toLocaleString(
        'en-IN',
      )} has been confirmed. You can now track your live delivery in My Orders.`,
      [
        {
          text: 'TRACK ORDER',
          onPress: () => handleNavigateTab('orders'),
        },
      ],
    );
  };

  // Navigation History & Back Handling
  const handleNavigateTab = (tab: TabKey) => {
    if (tab === currentTab) return;
    setTabHistory(prev => {
      if (tab === 'home') return ['home'];
      return [...prev, tab];
    });
    setCurrentTab(tab);
  };

  const handleGoBack = useCallback(() => {
    if (selectedProduct) {
      setSelectedProduct(null);
      return true;
    }
    if (searchVisible) {
      setSearchVisible(false);
      return true;
    }
    if (locationVisible) {
      setLocationVisible(false);
      return true;
    }
    if (commitmentDetailId) {
      setCommitmentDetailId(null);
      return true;
    }
    if (bookingVisible) {
      setBookingVisible(false);
      return true;
    }
    if (profileVisible) {
      setProfileVisible(false);
      return true;
    }
    if (authScreen) {
      setAuthScreen(null);
      setAuthRedirectMessage(null);
      return true;
    }
    if (currentTab !== 'home') {
      setTabHistory(prev => {
        const next = [...prev];
        next.pop();
        const prevTab = next.length > 0 ? next[next.length - 1] : 'home';
        setCurrentTab(prevTab);
        return next.length > 0 ? next : ['home'];
      });
      return true;
    }

    return false;
  }, [
    selectedProduct,
    searchVisible,
    locationVisible,
    commitmentDetailId,
    bookingVisible,
    profileVisible,
    authScreen,
    currentTab,
  ]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleGoBack,
    );
    return () => subscription.remove();
  }, [handleGoBack]);

  // Gated Booking
  const handleOpenBooking = (serviceTitle?: string) => {
    const targetService = serviceTitle || prefillService;
    setPrefillService(targetService);

    if (!user) {
      setPendingBookingService(targetService);
      setAuthRedirectMessage(
        'Please sign in or create an account to book your care.',
      );
      setAuthScreen('login');
      return;
    }

    setBookingVisible(true);
  };

  const handleCloseBooking = () => {
    setBookingVisible(false);
  };

  const handleBookingComplete = (newBooking: BookingData) => {
    setUserBookings(prev => [newBooking, ...prev]);
  };

  const handleLoginSuccess = (userData: { name: string; phone: string }) => {
    setUser(userData);
    setAuthScreen(null);
    setAuthRedirectMessage(null);

    if (pendingBookingService) {
      const svc = pendingBookingService;
      setPendingBookingService(null);
      setPrefillService(svc);
      setBookingVisible(true);
    } else {
      Alert.alert(
        'Welcome to Appuge',
        `Hello ${userData.name}! You are now signed in.`,
      );
    }
  };

  const handleRegisterSuccess = (userData: { name: string; phone: string }) => {
    setUser(userData);
    setAuthScreen(null);
    setAuthRedirectMessage(null);

    if (pendingBookingService) {
      const svc = pendingBookingService;
      setPendingBookingService(null);
      setPrefillService(svc);
      setBookingVisible(true);
    } else {
      Alert.alert(
        'Account Created',
        `Welcome to Appuge, ${userData.name}! Your postpartum care account is ready.`,
      );
    }
  };

  const handleLogout = () => {
    setUser(null);
    setProfileVisible(false);
    Alert.alert(
      'Signed Out',
      'You have been safely signed out of your account.',
    );
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (authScreen === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setAuthScreen('register')}
        onSkip={() => {
          setAuthScreen(null);
          setPendingBookingService(null);
          setAuthRedirectMessage(null);
        }}
        redirectMessage={authRedirectMessage || undefined}
      />
    );
  }

  if (authScreen === 'register') {
    return (
      <RegisterScreen
        onRegisterSuccess={handleRegisterSuccess}
        onNavigateToLogin={() => setAuthScreen('login')}
        onSkip={() => {
          setAuthScreen(null);
          setPendingBookingService(null);
          setAuthRedirectMessage(null);
        }}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar
          barStyle="dark-content"
          {...({
            backgroundColor: Colors.creamLight,
            translucent: false,
          } as any)}
        />

        {!commitmentDetailId && (
          <Header
            onOpenBooking={handleOpenBooking}
            user={user}
            onOpenAuth={() => {
              setAuthRedirectMessage(
                'Please sign in or create an account to access care.',
              );
              setAuthScreen('login');
            }}
            onOpenProfile={() => setProfileVisible(true)}
            onLogout={handleLogout}
            showBookButton={false}

            cartCount={cartCount}
            wishlistCount={wishlist.length}
            notificationCount={unreadNotifCount}
            currentLocality={currentLocality}
            onOpenLocation={() => setLocationVisible(true)}
            onOpenCart={() => handleNavigateTab('cart')}
            onOpenWishlist={() => handleNavigateTab('wishlist')}
            onOpenNotifications={() => setNotificationCentreVisible(true)}
            onOpenSearch={() => setSearchVisible(true)}
          />
        )}

        {/* Active Tab Screen */}
        <View style={styles.mainContent}>
          {commitmentDetailId ? (
            <CommitmentDetailScreen
              detailId={commitmentDetailId}
              onClose={() => setCommitmentDetailId(null)}
            />
          ) : currentTab === 'home' ? (
            <HomeScreen
              onOpenBooking={handleOpenBooking}
              onNavigateTab={handleNavigateTab}
              onOpenCommitmentDetail={setCommitmentDetailId}
              onReplaySplash={() => setShowSplash(true)}
              userName={user?.name}
              user={user}
              cart={cart}
              wishlist={wishlist}
              onOpenSearch={() => setSearchVisible(true)}
              onSelectItem={setSelectedProduct}
              onAddToCart={handleAddToCart}
              onUpdateQty={handleUpdateQty}
              onToggleWishlist={handleToggleWishlist}
              onSelectCategory={cat => {
                setShopCategory(cat);
              }}
            />
          ) : currentTab === 'shop' ? (
            <ShopScreen
              cart={cart}
              wishlist={wishlist}
              initialCategory={shopCategory}
              onOpenSearch={() => setSearchVisible(true)}
              onSelectItem={setSelectedProduct}
              onAddToCart={handleAddToCart}
              onUpdateQty={handleUpdateQty}
              onToggleWishlist={handleToggleWishlist}
            />
          ) : currentTab === 'wishlist' ? (
            <WishlistScreen
              items={COMMERCE_ITEMS.filter(item => wishlist.includes(item.id) && isShopProduct(item))}
              cart={cart}
              onShop={() => handleNavigateTab('shop')}
              onSelect={setSelectedProduct}
              onAdd={handleAddToCart}
              onQty={handleUpdateQty}
              onToggle={handleToggleWishlist}
              onClear={() => setWishlist([])}
            />
          ) : currentTab === 'cart' ? (
            <CartScreen
              cart={cart}
              items={COMMERCE_ITEMS}
              currentLocality={currentLocality}
              currentPincode={currentPincode}
              onOpenLocation={() => setLocationVisible(true)}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveFromCart}
              onClearCart={() => setCart({})}
              onPlaceOrder={handlePlaceOrder}
              onContinueShopping={() => handleNavigateTab('shop')}
            />
          ) : currentTab === 'orders' ? (
            <OrdersScreen
              orders={orders}
              onRepeatOrder={ord => {
                let addedCount = 0;
                ord.items.forEach(it => {
                  const found = COMMERCE_ITEMS.find(c => c.id === it.itemId);
                  if (found && isShopProduct(found)) {
                    handleAddToCart(found);
                    addedCount += 1;
                  }
                });
                if (addedCount > 0) {
                  handleNavigateTab('cart');
                } else {
                  Alert.alert(
                    'Items Unavailable',
                    'None of the items from this past order are available as physical products.',
                  );
                }
              }}
              onExploreStore={() => handleNavigateTab('shop')}
              onSelectItem={setSelectedProduct}
              onAddToCart={handleAddToCart}
            />
          ) : currentTab === 'nutrition' ? (
            <NutritionScreen onOpenBooking={handleOpenBooking} />
          ) : currentTab === 'nanny' || currentTab === 'services' ? (
            <NannyCareHomeScreen
              user={user}
              onOpenAuth={() => {
                setAuthRedirectMessage(
                  'Please sign in or create an account to book care.',
                );
                setAuthScreen('login');
              }}
              onGoBack={() => handleNavigateTab('home')}
            />
          ) : currentTab === 'doctors' ? (
            <DoctorsScreen
              user={user}
              onOpenAuth={() => {
                setAuthRedirectMessage(
                  'Please sign in or create an account to book an appointment.',
                );
                setAuthScreen('login');
              }}
              onNavigateTab={handleNavigateTab}
            />
          ) : currentTab === 'profile' ? (
            <ProfileScreen
              user={user}
              onSignIn={() => setAuthScreen('login')}
              onProfile={() => setProfileVisible(true)}
              onOrders={() => handleNavigateTab('orders')}
              onWishlist={() => handleNavigateTab('wishlist')}
              onCart={() => handleNavigateTab('cart')}
              onNannyCare={() => handleNavigateTab('nanny')}
              onSignOut={handleLogout}
            />
          ) : (
            <FaqScreen />
          )}
        </View>

        {/* E-Commerce Floating Cart Bar */}
        {currentTab !== 'cart' && currentTab !== 'nanny' && currentTab !== 'doctors' && (
          <FloatingCartBar
            count={cartCount}
            total={cartTotal}
            onPress={() => handleNavigateTab('cart')}
          />
        )}

        {/* Crisp Vector Navigation Bar with subtle Wishlist counter */}
        {!commitmentDetailId && (
          <BottomNav
            currentTab={currentTab}
            onSelectTab={handleNavigateTab}
            wishlistCount={wishlist.length}
          />
        )}

        {/* E-Commerce Modals */}
        <ProductDetailModal
          item={selectedProduct}
          visible={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          quantity={selectedProduct ? cart[selectedProduct.id] || 0 : 0}
          isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
        />

        <SearchModal
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
          onSelectItem={setSelectedProduct}
          onAddToCart={handleAddToCart}
          cart={cart}
        />

        <LocationModal
          visible={locationVisible}
          onClose={() => setLocationVisible(false)}
          currentLocality={currentLocality}
          currentPincode={currentPincode}
          onSelectLocation={(loc, pin) => {
            setCurrentLocality(loc);
            setCurrentPincode(pin);
          }}
        />

        {/* In-App Multi-Step Consultation Booking Modal (8 Steps) */}
        <BookingModal
          visible={bookingVisible}
          prefillService={prefillService}
          user={user}
          onClose={handleCloseBooking}
          onBookingComplete={handleBookingComplete}
        />

        {/* In-App Profile & Shopping Account Modal */}
        <ProfileModal
          visible={profileVisible}
          user={user}
          onClose={() => setProfileVisible(false)}
          onLogout={handleLogout}
          onSignIn={() => {
            setProfileVisible(false);
            setAuthScreen('login');
          }}
          onNavigateOrders={() => {
            setProfileVisible(false);
            handleNavigateTab('orders');
          }}
          onNavigateWishlist={() => {
            setProfileVisible(false);
            handleNavigateTab('wishlist');
          }}
          onNavigateCart={() => {
            setProfileVisible(false);
            handleNavigateTab('cart');
          }}
          onOpenNotificationPreferences={() => {
            setProfileVisible(false);
            setTimeout(() => setNotificationPreferencesVisible(true), 250);
          }}
        />

        {/* Global Notification Centre Modal */}
        <NotificationCentreModal
          visible={notificationCentreVisible}
          onClose={() => setNotificationCentreVisible(false)}
          onOpenSettings={() => {
            setNotificationCentreVisible(false);
            setTimeout(() => setNotificationPreferencesVisible(true), 250);
          }}
          navigationContext={{
            navigateTab: handleNavigateTab,
            onOpenOrder: () => handleNavigateTab('orders'),
            onOpenDoctorAppointment: () => handleNavigateTab('doctors'),
            onOpenNannyBooking: () => handleNavigateTab('nanny'),
            onOpenAnnouncement: () => handleNavigateTab('home'),
          }}
        />

        {/* Notification Preferences & Smart Alerts Settings Modal */}
        <NotificationPreferencesModal
          visible={notificationPreferencesVisible}
          onClose={() => setNotificationPreferencesVisible(false)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.creamLight,
  },
  mainContent: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
});

export default App;

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Colors, Fonts } from '../theme/colors';
import { AppIcon } from './common/AppIcon';
import { BENGALURU_LOCALITIES } from '../data/commerceData';

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  currentLocality: string;
  currentPincode: string;
  onSelectLocation: (locality: string, pincode: string) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  onClose,
  currentLocality,
  currentPincode,
  onSelectLocation,
}) => {
  const [search, setSearch] = React.useState('');

  const filteredLocalities = BENGALURU_LOCALITIES.filter(
    loc =>
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.pincode.includes(search) ||
      loc.zone.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetEyebrow}>CHOOSE DELIVERY LOCATION</Text>
              <Text style={styles.sheetTitle}>Bengaluru Service Zones</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityLabel="Close location picker">
              <AppIcon name="close" size={16} color={Colors.forestDark} />
            </TouchableOpacity>
          </View>

          {/* Current Selection Card */}
          <View style={styles.currentCard}>
            <View style={styles.currentLeft}>
              <View style={styles.currentIconBg}>
                <AppIcon name="location" size={16} color={Colors.terracotta} />
              </View>
              <View>
                <Text style={styles.currentLabel}>DELIVERING TO</Text>
                <Text style={styles.currentAddress}>
                  {currentLocality}, Bengaluru · {currentPincode}
                </Text>
              </View>
            </View>
            <View style={styles.currentTag}>
              <Text style={styles.currentTagText}>Active</Text>
            </View>
          </View>

          {/* Search Localities */}
          <View style={styles.searchBox}>
            <AppIcon name="search" size={15} color={Colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search locality, zone or pincode..."
              placeholderTextColor={Colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Quick Localities List */}
          <Text style={styles.listHeading}>POPULAR BENGALURU LOCALITIES</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.localityList}>
            {filteredLocalities.map(item => {
              const isSelected = item.name === currentLocality;
              return (
                <TouchableOpacity
                  key={item.pincode}
                  style={[
                    styles.localityRow,
                    isSelected && styles.localityRowActive,
                  ]}
                  onPress={() => {
                    onSelectLocation(item.name, item.pincode);
                    onClose();
                  }}
                  activeOpacity={0.7}>
                  <View style={styles.localityInfo}>
                    <Text
                      style={[
                        styles.localityName,
                        isSelected && styles.localityNameActive,
                      ]}>
                      {item.name}
                    </Text>
                    <Text style={styles.localitySub}>
                      {item.zone} · {item.pincode}
                    </Text>
                  </View>
                  <View style={styles.localityRight}>
                    <Text style={styles.etaBadge}>⚡ {item.eta}</Text>
                    {isSelected && (
                      <View style={styles.checkIcon}>
                        <AppIcon name="check" size={13} color="white" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(22, 40, 30, 0.45)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: Colors.creamLight,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: Colors.sage,
  },
  sheetTitle: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    color: Colors.forestDark,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(200, 109, 81, 0.3)',
    marginBottom: 14,
  },
  currentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  currentIconBg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(200, 109, 81, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.terracotta,
  },
  currentAddress: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.forestDark,
    marginTop: 1,
  },
  currentTag: {
    backgroundColor: Colors.forestDark,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  currentTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.forestDark,
    padding: 0,
  },
  listHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  localityList: {
    gap: 8,
    paddingBottom: 20,
  },
  localityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFDF9',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  localityRowActive: {
    borderColor: Colors.terracotta,
    backgroundColor: '#FFF8F4',
  },
  localityInfo: {
    flex: 1,
  },
  localityName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.forestDark,
  },
  localityNameActive: {
    color: Colors.terracotta,
  },
  localitySub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  localityRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  etaBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.forestDark,
    backgroundColor: 'rgba(44, 64, 53, 0.08)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

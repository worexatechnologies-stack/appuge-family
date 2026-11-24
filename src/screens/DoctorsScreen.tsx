import React from 'react';
import { DoctorsHomeScreen } from './doctors/DoctorsHomeScreen';

interface DoctorsScreenProps {
  onOpenBooking?: (serviceTitle?: string) => void;
  user?: { name: string; phone: string } | null;
  onOpenAuth?: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const DoctorsScreen: React.FC<DoctorsScreenProps> = props => {
  return (
    <DoctorsHomeScreen
      user={props.user}
      onOpenAuth={props.onOpenAuth}
      onNavigateTab={props.onNavigateTab}
    />
  );
};

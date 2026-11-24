import {
  calculateNannyBookingPrice,
  DEMO_NANNIES,
  INITIAL_NANNY_BOOKINGS,
  INITIAL_VERIFICATION_QUEUE,
} from '../src/data/nannyCareData';

describe('Nanny Care Domain Logic', () => {
  it('correctly calculates booking price breakdown with platform fee and GST', () => {
    // 350/hr * 4 hrs/day * 5 days = 7000 base
    const price = calculateNannyBookingPrice(350, 4, 5);
    expect(price.subtotal).toBe(7000);
    expect(price.platformServiceFee).toBe(350); // 5% of 7000
    // taxes = 5% of (7000 + 350 = 7350) => 368
    expect(price.taxes).toBe(368);
    expect(price.totalAmount).toBe(7718);
  });

  it('contains valid initial nannies with Bangalore service areas and verification records', () => {
    expect(DEMO_NANNIES.length).toBeGreaterThanOrEqual(4);
    for (const nanny of DEMO_NANNIES) {
      expect(nanny.id).toMatch(/^nan-/);
      expect(nanny.hourlyRate).toBeGreaterThan(0);
      expect(nanny.serviceAreas.length).toBeGreaterThan(0);
      expect(typeof nanny.verifiedBadges.govtIdentityVerified).toBe('boolean');
      expect(typeof nanny.verifiedBadges.policeBackgroundCheck).toBe('boolean');
    }
  });

  it('initial bookings have valid lifecycle status', () => {
    expect(INITIAL_NANNY_BOOKINGS.length).toBeGreaterThanOrEqual(2);
    for (const b of INITIAL_NANNY_BOOKINGS) {
      expect(b.id).toMatch(/^nbk-/);
      expect(['REQUESTED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED']).toContain(b.status);
      expect(b.totalAmount).toBeGreaterThan(0);
    }
  });

  it('verification queue has items for admin review', () => {
    expect(INITIAL_VERIFICATION_QUEUE.length).toBeGreaterThanOrEqual(1);
    expect(INITIAL_VERIFICATION_QUEUE[0].currentStatus).toBe('PENDING');
  });
});

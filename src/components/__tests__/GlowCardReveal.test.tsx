import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import GlowCardReveal, { RewardType, GlowCardRevealProps } from '../GlowCardReveal';

describe('GlowCardReveal', () => {
  const baseProps: GlowCardRevealProps = {
    onRewardClaimed: jest.fn(),
    userTokens: 100,
    isPlusUser: true,
    streakSavers: 0,
    onUpdateTokens: jest.fn(),
    onUpdateStreakSavers: jest.fn(),
    onShareReward: jest.fn(),
    picksLeft: 1,
    localization: (key) => key,
  };

  it('renders 5 cards', () => {
    const { getAllByA11yLabel } = render(<GlowCardReveal {...baseProps} />);
    expect(getAllByA11yLabel(/Card \d, tap to reveal reward/)).toHaveLength(5);
  });

  it('flips a card and shows claim button', async () => {
    const { getAllByA11yLabel, getByText } = render(<GlowCardReveal {...baseProps} />);
    const cards = getAllByA11yLabel(/Card \d, tap to reveal reward/);
    await act(async () => {
      fireEvent.press(cards[2]);
      await new Promise((r) => setTimeout(r, 700));
    });
    expect(getByText('Claim')).toBeTruthy();
  });

  it('handles paid pick for Plus user', async () => {
    const { getAllByText, getByText } = render(<GlowCardReveal {...baseProps} />);
    await act(async () => {
      fireEvent.press(getByText('Claim'));
      fireEvent.press(getByText('Pick Again (50 Tokens)?'));
    });
    expect(baseProps.onUpdateTokens).toHaveBeenCalledWith(50);
  });

  it('shows error for non-Plus user paid pick', async () => {
    const props = { ...baseProps, isPlusUser: false };
    const { getByText } = render(<GlowCardReveal {...props} />);
    await act(async () => {
      fireEvent.press(getByText('Claim'));
      fireEvent.press(getByText('Pick Again (50 Tokens)?'));
    });
    expect(getByText('Paid picks are for Plus users only!')).toBeTruthy();
  });

  it('shows error for insufficient tokens', async () => {
    const props = { ...baseProps, userTokens: 10 };
    const { getByText } = render(<GlowCardReveal {...props} />);
    await act(async () => {
      fireEvent.press(getByText('Claim'));
      fireEvent.press(getByText('Pick Again (50 Tokens)?'));
    });
    expect(getByText('Not enough Tokens!')).toBeTruthy();
  });
});

// Pure logic test for getRandomReward
import { getRandomReward } from '../GlowCardReveal';
describe('getRandomReward', () => {
  it('returns a valid reward type', () => {
    for (let i = 0; i < 100; i++) {
      const reward = getRandomReward();
      expect(['tokens', 'glowbag_common', 'glowbag_rare', 'streak_saver', 'extra_pick']).toContain(reward.type);
    }
  });
});

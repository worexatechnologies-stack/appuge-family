import React from 'react';
import { Animated, Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { AppugePromise } from '../src/components/AppugePromise';
import {
  COMMITMENT_DETAILS,
  CommitmentDetailId,
} from '../src/data/commitmentDetails';
import { CommitmentDetailScreen } from '../src/screens/CommitmentDetailScreen';

jest.mock('../src/theme/responsive', () => ({
  useAppInsets: () => ({ bottom: 0 }),
}));

const noOpAnimation: Animated.CompositeAnimation = {
  start: callback => callback?.({ finished: true }),
  stop: jest.fn(),
  reset: jest.fn(),
};

beforeEach(() => {
  jest.spyOn(Animated, 'timing').mockReturnValue(noOpAnimation);
  jest.spyOn(Animated, 'spring').mockReturnValue(noOpAnimation);
  jest.spyOn(Animated, 'stagger').mockReturnValue(noOpAnimation);
});

afterEach(() => {
  jest.restoreAllMocks();
});

const commitmentIds: CommitmentDetailId[] = [
  'background-checks',
  'health-screened',
  'professionally-trained',
  'compassionately-matched',
];

test('each commitment card opens its corresponding detail', async () => {
  const onOpenDetail = jest.fn();
  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <AppugePromise onOpenDetail={onOpenDetail} />,
    );
  });

  const cardsByLabel = new Map(
    renderer!.root
      .findAll(
        node =>
          node.props.accessibilityRole === 'button' &&
          typeof node.props.accessibilityLabel === 'string' &&
          typeof node.props.onPress === 'function',
      )
      .map(node => [node.props.accessibilityLabel, node]),
  );
  expect(cardsByLabel.size).toBe(commitmentIds.length);

  for (const [index, detailId] of commitmentIds.entries()) {
    const card = Array.from(cardsByLabel.values())[index];
    await ReactTestRenderer.act(() => {
      card.props.onPress();
    });
    expect(onOpenDetail).toHaveBeenLastCalledWith(detailId);
  }

  await ReactTestRenderer.act(() => {
    renderer!.unmount();
  });
});

test.each(commitmentIds)('%s has a dedicated details page', async detailId => {
  const onClose = jest.fn();
  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <CommitmentDetailScreen detailId={detailId} onClose={onClose} />,
    );
  });

  const renderedTexts = renderer!.root
    .findAllByType(Text)
    .map(node => node.props.children);
  const detail = COMMITMENT_DETAILS[detailId];

  expect(renderedTexts).toContain(detail.title);
  detail.sections.forEach(section => {
    expect(renderedTexts).toContain(section.title);
  });
  const backButton = renderer!.root.find(
    node =>
      node.props.accessibilityLabel === 'Back to Home' &&
      typeof node.props.onPress === 'function',
  );
  await ReactTestRenderer.act(() => {
    backButton.props.onPress();
  });
  expect(onClose).toHaveBeenCalledTimes(1);

  await ReactTestRenderer.act(() => {
    renderer!.unmount();
  });
});

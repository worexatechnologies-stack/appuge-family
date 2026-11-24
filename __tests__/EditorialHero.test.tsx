import React from 'react';
import { Image, Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { EditorialHero } from '../src/components/EditorialHero';
import { HERO_SLIDES } from '../src/data/appugeData';
import { HomeScreen } from '../src/screens/HomeScreen';

test('renders four distinct editorial slides and images', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <EditorialHero onOpenBooking={jest.fn()} onExploreServices={jest.fn()} />,
    );
  });

  const renderedTexts = renderer!.root
    .findAllByType(Text)
    .map(node => node.props.children);
  const imageSources = renderer!.root
    .findAllByType(Image)
    .map(node => node.props.source);
  const paginationTargets = renderer!.root.findAll(
    node =>
      typeof node.props.accessibilityLabel === 'string' &&
      node.props.accessibilityLabel.startsWith('Go to slide '),
  );

  expect(HERO_SLIDES).toHaveLength(4);
  expect(new Set(HERO_SLIDES.map(slide => slide.layout)).size).toBe(4);
  HERO_SLIDES.forEach(slide => {
    expect(renderedTexts).toContain(slide.headline);
  });
  expect(new Set(imageSources).size).toBe(4);
  expect(
    new Set(paginationTargets.map(node => node.props.accessibilityLabel)).size,
  ).toBe(4);

  await ReactTestRenderer.act(() => {
    renderer!.unmount();
  });
});

test('HomeScreen renders the commerce editorial hero', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <HomeScreen
        onOpenBooking={jest.fn()}
        onNavigateTab={jest.fn()}
        onOpenCommitmentDetail={jest.fn()}
        onReplaySplash={jest.fn()}
      />,
    );
  });

  const renderedTexts = renderer!.root
    .findAllByType(Text)
    .map(node => node.props.children);
  expect(renderedTexts).toContain('THE APPUGE EDIT');
  expect(renderedTexts).toContain('Thoughtfully chosen essentials for you and your baby.');
  expect(renderedTexts).toContain('Little favourites');

  await ReactTestRenderer.act(() => {
    renderer!.unmount();
  });
});

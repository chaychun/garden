// Left-most possible position for an open card, calculated dynamically based on viewport width
const getBaseOpenPosition = (viewportWidth: number): number =>
  viewportWidth * 0.2;

const STACK_INCREMENT = 30;
const CLOSED_APPROACHING_OFFSETS = [20, 0];
const OPEN_APPROACHING_OFFSETS = [80, 40, 20, 10, 0];
const COLLAPSED_APPROACHING_OFFSETS = [180, 90, 30, 0];

const PEEK_OFFSET_LEFT = -20;
const PEEK_OFFSET_RIGHT_MAP = [20, 30, 40, 50, 60];

const MAX_CARDS_OPEN = 5;
const MAX_CARDS_CLOSED = 2;
const MAX_CARDS_COLLAPSED = 4;

const calculateApproachingOffset = (
  index: number,
  total: number,
  isInOpenStack: boolean,
  isCollapsed: boolean = false,
): number => {
  const offsets = isCollapsed
    ? COLLAPSED_APPROACHING_OFFSETS
    : isInOpenStack
      ? OPEN_APPROACHING_OFFSETS
      : CLOSED_APPROACHING_OFFSETS;
  const count = isCollapsed ? index : isInOpenStack ? total - index - 1 : index;
  const offsetIndex = Math.min(count, offsets.length - 1);

  return offsets[offsetIndex];
};

const calculateIncrement = (
  index: number,
  total: number,
  isInOpenStack: boolean,
  isCollapsed: boolean = false,
  maxCardsOpen: number = MAX_CARDS_OPEN,
  maxCardsClosed: number = MAX_CARDS_CLOSED,
): number => {
  let multiplier;
  if (isCollapsed) {
    multiplier = MAX_CARDS_COLLAPSED - index;
  } else if (isInOpenStack) {
    multiplier =
      total <= maxCardsOpen ? index : Math.max(0, maxCardsOpen - total + index);
  } else {
    if (maxCardsClosed <= 0) {
      multiplier = -1 - index;
    } else {
      multiplier = maxCardsClosed - index;
    }
  }
  return multiplier * STACK_INCREMENT;
};

const getPosition = (
  index: number,
  totalInSegment: number,
  isInOpenStack: boolean,
  viewportWidth: number,
  isCollapsed: boolean = false,
  maxCardsOpen: number = MAX_CARDS_OPEN,
  maxCardsClosed: number = MAX_CARDS_CLOSED,
): number => {
  const effectiveIsInOpenStack = isCollapsed ? false : isInOpenStack;

  // For open stack, non-visible cards have no offset or increment
  if (
    !isCollapsed &&
    isInOpenStack &&
    totalInSegment > maxCardsOpen &&
    index < totalInSegment - maxCardsOpen + 1
  ) {
    const approachingOffset = 0;
    const increment = 0;
    return getBaseOpenPosition(viewportWidth) + approachingOffset + increment;
  }

  const approachingOffset = calculateApproachingOffset(
    index,
    totalInSegment,
    effectiveIsInOpenStack,
    isCollapsed,
  );
  const increment = calculateIncrement(
    index,
    totalInSegment,
    effectiveIsInOpenStack,
    isCollapsed,
    maxCardsOpen,
    maxCardsClosed,
  );

  if (!isCollapsed && isInOpenStack) {
    return getBaseOpenPosition(viewportWidth) + approachingOffset + increment;
  } else {
    return viewportWidth - approachingOffset - increment;
  }
};

const getStackPositions = (
  activeIndex: number,
  total: number,
  viewportWidth: number,
  maxCardsOpen: number = MAX_CARDS_OPEN,
  maxCardsClosed: number = MAX_CARDS_CLOSED,
  widthsPx?: number[], // Array of widths (px) for each card
): number[] => {
  if (total === 0) {
    return [];
  }

  const allPositions: number[] = new Array(total).fill(0);

  if (activeIndex === -1) {
    for (let i = 0; i < total; i++) {
      allPositions[i] = getPosition(
        i,
        total,
        false,
        viewportWidth,
        true,
        maxCardsOpen,
        maxCardsClosed,
      );
    }
  } else {
    // 1. Open cards
    const numOpenCards = activeIndex + 1;
    for (let i = 0; i < numOpenCards; i++) {
      allPositions[i] = getPosition(
        i,
        numOpenCards,
        true,
        viewportWidth,
        false,
        maxCardsOpen,
        maxCardsClosed,
      );
    }

    // 2. Closed cards
    const numClosedCards = total - numOpenCards;
    for (let i = 0; i < numClosedCards; i++) {
      allPositions[numOpenCards + i] = getPosition(
        i,
        numClosedCards,
        false,
        viewportWidth,
        false,
        maxCardsOpen,
        maxCardsClosed,
      );
    }
  }

  // Cap the visible part of each card to its width, so it doesn't overlap the next card
  // Loop from top down
  // Skip as many cards as possible to reduce recursion
  if (widthsPx && widthsPx.length === total && activeIndex !== -1) {
    for (let i = activeIndex; i >= 0; i--) {
      if (i <= activeIndex - maxCardsOpen) continue;

      const originalPosition = allPositions[i];

      // Reference is the next card's position, or viewport width for the last card
      const referencePosition =
        i + 1 < total && allPositions[i + 1] !== undefined
          ? allPositions[i + 1]
          : viewportWidth;
      // Use max(original, reference - width)
      allPositions[i] = Math.max(
        originalPosition,
        referencePosition - widthsPx[i],
      );
    }
  }

  return allPositions;
};

const getStackPeekOffsets = (
  hoveredIndex: number | null,
  activeIndex: number,
  numCards: number,
): number[] => {
  const offsets = new Array(numCards).fill(0);

  if (hoveredIndex === null || hoveredIndex === activeIndex) {
    // No offsets needed if no card is hovered or if hovering the active card
    return offsets;
  } else if (hoveredIndex > activeIndex) {
    // Shift itself left
    offsets[hoveredIndex] = PEEK_OFFSET_LEFT;
    return offsets;
  } else {
    // Shift open cards above the hovered card to the right (according to offset map)
    for (let i = activeIndex; i > hoveredIndex; i--) {
      offsets[i] = PEEK_OFFSET_RIGHT_MAP[activeIndex - i];
    }
  }

  return offsets;
};

export { getStackPositions, getStackPeekOffsets };

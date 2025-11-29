import { ScrollView, Dimensions, View } from 'react-native';
import { RefObject } from 'react';

/**
 * Global scroll manager to ensure only one scroll operation at a time
 * This prevents competing scroll operations when multiple cards are interacted with
 */
class ScrollManager {
  private static currentScrollTimeout: number | null = null;
  private static currentScrollOperation: (() => void) | null = null;

  /**
   * Schedule a scroll operation, cancelling any existing operation
   * @param scrollOperation Function to execute the scroll
   * @param delay Delay in milliseconds before executing (default: 150ms)
   */
  static scheduleScroll(scrollOperation: () => void, delay: number = 150) {
    // Cancel any existing scroll operation
    if (this.currentScrollTimeout) {
      clearTimeout(this.currentScrollTimeout);
    }

    // Store the new operation and schedule it
    this.currentScrollOperation = scrollOperation;
    this.currentScrollTimeout = setTimeout(() => {
      if (this.currentScrollOperation === scrollOperation) {
        scrollOperation();
        this.currentScrollOperation = null;
        this.currentScrollTimeout = null;
      }
    }, delay) as unknown as number;
  }

  /**
   * Cancel the current scroll operation if any
   */
  static cancelCurrent() {
    if (this.currentScrollTimeout) {
      clearTimeout(this.currentScrollTimeout);
      this.currentScrollTimeout = null;
      this.currentScrollOperation = null;
    }
  }

  /**
   * Scroll a specific card to a target position (20% from top by default)
   * @param cardRef Reference to the card component
   * @param scrollViewRef Reference to the scroll view
   * @param targetPercentFromTop Target position as percentage from top (0.2 = 20%)
   */
  static scrollCardToPosition(
    cardRef: RefObject<View | null>,
    scrollViewRef: RefObject<ScrollView | null> | undefined,
    targetPercentFromTop: number = 0.2,
  ) {
    if (!scrollViewRef?.current || !cardRef?.current) {
      return;
    }

    // Use a different approach: measure the card relative to its ScrollView parent
    try {
      // First, let's try to use measureLayout with the ScrollView's content container
      const scrollViewInstance = scrollViewRef.current;

      // @ts-ignore - measureLayout expects a number but works with component instance in some versions
      cardRef.current.measureLayout(
        scrollViewInstance as unknown as number,
        (x: number, y: number, width: number, height: number) => {
          // y is now the position within the ScrollView content
          const screenHeight = Dimensions.get('window').height;
          const desiredPosition = screenHeight * targetPercentFromTop;

          // Calculate target scroll position
          const targetScrollY = y - desiredPosition;

          scrollViewRef.current?.scrollTo({
            y: Math.max(0, targetScrollY),
            animated: true,
          });
        },
        () => {
          // Fallback if measureLayout fails
          this.fallbackScrollToPosition(
            cardRef,
            scrollViewRef,
            targetPercentFromTop,
          );
        },
      );
    } catch (error) {
      this.fallbackScrollToPosition(
        cardRef,
        scrollViewRef,
        targetPercentFromTop,
      );
    }
  }

  /**
   * Fallback scroll method using measureInWindow
   */
  private static fallbackScrollToPosition(
    cardRef: RefObject<View | null>,
    scrollViewRef: RefObject<ScrollView | null> | undefined,
    targetPercentFromTop: number = 0.2,
  ) {
    if (!cardRef.current || !scrollViewRef?.current) return;

    cardRef.current.measureInWindow(
      (cardX: number, cardY: number, cardWidth: number, cardHeight: number) => {
        (scrollViewRef.current as unknown as View).measureInWindow(
          (
            scrollX: number,
            scrollY: number,
            scrollWidth: number,
            scrollHeight: number,
          ) => {
            const cardTopRelativeToScrollView = cardY - scrollY;
            const desiredPosition = scrollHeight * targetPercentFromTop;
            const targetScrollY = cardTopRelativeToScrollView - desiredPosition;

            scrollViewRef.current?.scrollTo({
              y: Math.max(0, targetScrollY),
              animated: true,
            });
          },
        );
      },
    );
  }
}

export default ScrollManager;

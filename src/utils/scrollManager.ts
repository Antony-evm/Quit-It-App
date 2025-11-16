import { ScrollView, Dimensions } from 'react-native';

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
    cardRef: any,
    scrollViewRef: any,
    targetPercentFromTop: number = 0.2,
  ) {
    if (!scrollViewRef?.current || !cardRef?.current) {
      return;
    }

    // Use a different approach: measure the card relative to its ScrollView parent
    try {
      // First, let's try to use measureLayout with the ScrollView's content container
      const scrollViewInstance = scrollViewRef.current;

      cardRef.current.measureLayout(
        scrollViewInstance,
        (x: number, y: number, width: number, height: number) => {
          // y is now the position within the ScrollView content
          const screenHeight = Dimensions.get('window').height;
          const desiredPosition = screenHeight * targetPercentFromTop;

          // Calculate target scroll position
          const targetScrollY = y - desiredPosition;

          console.log('ScrollManager measureLayout:', {
            cardPositionInContent: y,
            desiredPosition,
            targetScrollY: Math.max(0, targetScrollY),
          });

          scrollViewRef.current?.scrollTo({
            y: Math.max(0, targetScrollY),
            animated: true,
          });
        },
        () => {
          // Fallback if measureLayout fails
          console.log('measureLayout failed, using fallback approach');
          this.fallbackScrollToPosition(
            cardRef,
            scrollViewRef,
            targetPercentFromTop,
          );
        },
      );
    } catch (error) {
      console.log('measureLayout error, using fallback:', error);
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
    cardRef: any,
    scrollViewRef: any,
    targetPercentFromTop: number = 0.2,
  ) {
    cardRef.current.measureInWindow(
      (cardX: number, cardY: number, cardWidth: number, cardHeight: number) => {
        scrollViewRef.current.measureInWindow(
          (
            scrollX: number,
            scrollY: number,
            scrollWidth: number,
            scrollHeight: number,
          ) => {
            const cardTopRelativeToScrollView = cardY - scrollY;
            const desiredPosition = scrollHeight * targetPercentFromTop;
            const targetScrollY = cardTopRelativeToScrollView - desiredPosition;

            console.log('ScrollManager fallback:', {
              cardY,
              scrollY,
              cardTopRelativeToScrollView,
              desiredPosition,
              targetScrollY: Math.max(0, targetScrollY),
            });

            scrollViewRef.current.scrollTo({
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

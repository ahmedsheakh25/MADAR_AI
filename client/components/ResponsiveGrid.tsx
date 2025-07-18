import React, { ReactNode } from 'react';
import { useResponsive } from '../hooks/useResponsive';

interface ResponsiveGridProps {
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
  className?: string;
  maxItemsMobile?: number;
  maxItemsTablet?: number;
  maxItemsDesktop?: number;
  gridClassName?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  items,
  renderItem,
  className = '',
  maxItemsMobile = 4,
  maxItemsTablet = 6,
  maxItemsDesktop = items.length,
  gridClassName = ''
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const getVisibleItems = () => {
    if (isMobile) return items.slice(0, maxItemsMobile);
    if (isTablet) return items.slice(0, maxItemsTablet);
    return items.slice(0, maxItemsDesktop);
  };

  const getGridCols = () => {
    if (isMobile) return 'grid-cols-2';
    if (isTablet) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  const visibleItems = getVisibleItems();

  return (
    <div className={`responsive-grid-container ${className}`}>
      <div className={`responsive-grid ${getGridCols()} ${gridClassName}`}>
        {visibleItems.map((item, index) => (
          <div key={index} className="grid-item">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      
      {/* Show count indicator if items are hidden */}
      {visibleItems.length < items.length && (
        <div className="mt-2 text-center text-sm text-gray-500">
          Showing {visibleItems.length} of {items.length} items
          {isMobile && ' (mobile view)'}
          {isTablet && ' (tablet view)'}
        </div>
      )}
    </div>
  );
};

// Specialized components for common use cases
interface ResponsiveCardGridProps extends Omit<ResponsiveGridProps, 'renderItem'> {
  cards: Array<{ title: string; content: ReactNode; id?: string | number }>;
  cardClassName?: string;
}

export const ResponsiveCardGrid: React.FC<ResponsiveCardGridProps> = ({
  cards,
  cardClassName = '',
  ...gridProps
}) => {
  const renderCard = (card: any, index: number) => (
    <div className={`card-item ${cardClassName}`} key={card.id || index}>
      <h3 className="card-title text-responsive">{card.title}</h3>
      <div className="card-content">{card.content}</div>
    </div>
  );

  return (
    <ResponsiveGrid
      items={cards}
      renderItem={renderCard}
      {...gridProps}
    />
  );
};

export default ResponsiveGrid; 
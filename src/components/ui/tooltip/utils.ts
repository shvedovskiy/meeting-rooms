import { RefObject } from 'react';

type Position =
  | 'top left'
  | 'top center'
  | 'top right'
  | 'right top'
  | 'right center'
  | 'right bottom'
  | 'bottom left'
  | 'bottom center'
  | 'bottom right'
  | 'left top'
  | 'left center'
  | 'left bottom'
  | 'center center';

const POSITION_TYPES: Position[] = [
  'top left',
  'top center',
  'top right',
  'right top',
  'right center',
  'right bottom',
  'bottom left',
  'bottom center',
  'bottom right',
  'left top',
  'left center',
  'left bottom',
  'center center',
];

type OffsetType = {
  offsetX?: number;
  offsetY?: number;
};

function getCoordinatesForPosition(
  triggerBounding: ClientRect | DOMRect,
  contentBounding: ClientRect | DOMRect,
  position: Position,
  { offsetX, offsetY }: OffsetType
) {
  const margin = 8;
  const args = position.split(' ');

  const centerTop = triggerBounding.top + triggerBounding.height / 2;
  const centerLeft = triggerBounding.left + triggerBounding.width / 2;
  const { height, width } = contentBounding;
  let top = centerTop - height / 2;
  let left = centerLeft - width / 2;
  let transform = '';
  let arrowTop = '0%';
  let arrowLeft = '0%';

  switch (args[0]) {
    case 'top':
      top -= height / 2 + triggerBounding.height / 2 + margin;
      transform = `rotate(45deg)`;
      arrowTop = '100%';
      arrowLeft = '50%';
      break;
    case 'bottom':
      top += height / 2 + triggerBounding.height / 2 + margin;
      transform = `rotate(225deg)`;
      arrowLeft = '50%';
      break;
    case 'left':
      left -= width / 2 + triggerBounding.width / 2 + margin;
      transform = ` rotate(-45deg)`;
      arrowLeft = '100%';
      arrowTop = '50%';
      break;
    case 'right':
      left += width / 2 + triggerBounding.width / 2 + margin;
      transform = `rotate(135deg)`;
      arrowTop = '50%';
      break;
    default:
  }
  switch (args[1]) {
    case 'top':
      top = triggerBounding.top;
      arrowTop = `${triggerBounding.height / 2}px`;
      break;
    case 'bottom':
      top = triggerBounding.top - height + triggerBounding.height;
      arrowTop = `${height - triggerBounding.height / 2}px`;
      break;
    case 'left':
      left = triggerBounding.left;
      arrowLeft = `${triggerBounding.width / 2}px`;
      break;
    case 'right':
      left = triggerBounding.left - width + triggerBounding.width;
      arrowLeft = `${width - triggerBounding.width / 2}px`;
      break;
    default:
  }
  if (offsetY) {
    top = args[0] === 'top' ? top - offsetY : top + offsetY;
  }
  if (offsetX) {
    left = args[0] === 'left' ? left - offsetX : left + offsetX;
  }
  return { top, left, transform, arrowLeft, arrowTop };
}

export function calculatePosition(
  triggerElement: RefObject<HTMLElement> | undefined,
  contentElement: RefObject<HTMLDivElement> | undefined,
  offsets: OffsetType
) {
  const wrapperBox = {
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };
  if (!triggerElement || !triggerElement.current) {
    return;
  }
  if (!contentElement || !contentElement.current) {
    console.log('alo2');
    return;
  }

  const triggerBounding = triggerElement.current.getBoundingClientRect();
  const contentBounding = contentElement.current.getBoundingClientRect();

  let bestCoords;
  let i = 0;
  while (i < POSITION_TYPES.length) {
    bestCoords = getCoordinatesForPosition(
      triggerBounding,
      contentBounding,
      POSITION_TYPES[i],
      offsets
    );
    const contentBox = {
      top: bestCoords.top,
      left: bestCoords.left,
      width: contentBounding.width,
      height: contentBounding.height,
    };

    if (
      contentBox.top <= wrapperBox.top ||
      contentBox.left <= wrapperBox.left ||
      contentBox.top + contentBox.height >=
        wrapperBox.top + wrapperBox.height ||
      contentBox.left + contentBox.width >= wrapperBox.left + wrapperBox.width
    ) {
      i++;
    } else {
      break;
    }
  }
  return bestCoords;
}

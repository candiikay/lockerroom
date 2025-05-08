import React from 'react';
import { useControls } from 'leva';

export default function DebugControls() {
  const {
    showHelpers,
    showGrid,
    lockerPosition,
    lockerSize,
    whiteboardPosition,
    whiteboardSize,
    refrigeratorPosition,
    refrigeratorSize,
    beanbagPosition,
    beanbagSize,
    boomboxPosition,
    boomboxSize
  } = useControls({
    showHelpers: {
      value: true,
      label: 'Show Hotspot Boxes'
    },
    showGrid: {
      value: true,
      label: 'Show Grid'
    },
    lockerPosition: {
      value: [1.8, 1.5, -0.8],
      step: 0.1,
      label: 'Locker Position (X/Y/Z)'
    },
    lockerSize: {
      value: [1.0, 2.0, 0.5],
      step: 0.1,
      label: 'Locker Size (W/H/D)'
    },
    whiteboardPosition: {
      value: [-1.5, 1.7, -2.0],
      step: 0.1,
      label: 'Whiteboard Position (X/Y/Z)'
    },
    whiteboardSize: {
      value: [2.0, 1.5, 0.1],
      step: 0.1,
      label: 'Whiteboard Size (W/H/D)'
    },
    refrigeratorPosition: {
      value: [-1.8, 1.0, 1.2],
      step: 0.1,
      label: 'Refrigerator Position (X/Y/Z)'
    },
    refrigeratorSize: {
      value: [0.8, 2.0, 0.8],
      step: 0.1,
      label: 'Refrigerator Size (W/H/D)'
    },
    beanbagPosition: {
      value: [0.2, 0.4, 1.8],
      step: 0.1,
      label: 'Beanbag Position (X/Y/Z)'
    },
    beanbagSize: {
      value: [1.4, 0.8, 1.4],
      step: 0.1,
      label: 'Beanbag Size (W/H/D)'
    },
    boomboxPosition: {
      value: [1.2, 0.8, -1.4],
      step: 0.1,
      label: 'Boombox Position (X/Y/Z)'
    },
    boomboxSize: {
      value: [0.5, 0.3, 0.3],
      step: 0.1,
      label: 'Boombox Size (W/H/D)'
    }
  });

  return {
    showHelpers,
    showGrid,
    locker: {
      position: lockerPosition,
      size: lockerSize
    },
    whiteboard: {
      position: whiteboardPosition,
      size: whiteboardSize
    },
    refrigerator: {
      position: refrigeratorPosition,
      size: refrigeratorSize
    },
    beanbag: {
      position: beanbagPosition,
      size: beanbagSize
    },
    boombox: {
      position: boomboxPosition,
      size: boomboxSize
    }
  };
} 
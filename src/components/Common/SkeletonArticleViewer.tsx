import { Skeleton } from '@material-ui/lab';
import React from 'react';

function SkeletonArticleViewer() {
  return (
    <div>
      <Skeleton variant='rect' height={200} />
      <Skeleton variant='text' height={80} />
      <Skeleton variant='text' height={80} />
    </div>
  );
}

export default SkeletonArticleViewer;

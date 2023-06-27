import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

function SkeletonArticleEditor() {
  return (
    <>
      <Skeleton variant='text' height={80} />
      <Skeleton variant='text' height={80} />
      <br />
      <Skeleton variant='rect' height={500} />
    </>
  );
}

export default SkeletonArticleEditor;

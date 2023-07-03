import React from 'react';
import { styled } from 'styled-components';

function EmptyArticle() {
  return (
    <EmptyArticleStyled>
      <h4>Chưa có bài viết nào</h4>
      <i className='ion-ios-paper-outline'></i>
    </EmptyArticleStyled>
  );
}

export default EmptyArticle;

const EmptyArticleStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  i {
    font-size: 100px;
    color: #5cb85c;
  }
`;

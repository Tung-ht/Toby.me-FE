import { styled } from 'styled-components';

export const ArticlePageStyled = styled.div`
  .thumbs-article-page {
    width: 100%;
    border-radius: 4px;
  }

  .wrapper-content {
    margin-top: 20px;
    display: flex;

    .wrapper-content-left {
      width: 185px;
      height: 100%;
    }

    .wrapper-content-right {
      flex: 1;
    }
  }

  .article-description {
    margin-bottom: 12px;
  }

  .article-date {
    font-size: 16px;
    color: #a3a3a3;
    font-weight: 500;
    margin-right: 8px;
  }

  .tag-label {
    margin-top: 12px;
    color: #040a17;
    font-size: 21px;
    line-height: 1.33em;
    font-weight: 600;
  }
`;

export const ArticlePageBannerStyled = styled.div``;

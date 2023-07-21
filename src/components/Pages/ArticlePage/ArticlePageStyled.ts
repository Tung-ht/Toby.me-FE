import { styled } from 'styled-components';

export const ArticlePageStyled = styled.div`
  .thumbs-article-page {
    width: 100%;
    border-radius: 4px;
  }

  .wrapper-content {
    margin-top: 20px;
    display: flex;
    background: #ffffff;
    border: 1px solid #eaebec;
    border-radius: 8px;
    padding: 12px;

    .wrapper-content-left {
      width: 200px;
      height: 100%;
      padding-right: 10px;
    }

    .wrapper-content-right {
      width: calc(100% - 200px);
      padding-left: 10px;
      border-left: 1px solid #eaebec;
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

  #article-content-styled {
    font-size: 16px;

    /* Thẻ tiêu đề */
    h1,
    h2,
    h3 {
      font-weight: bold;
    }

    h1 {
      font-size: 28px;
      margin-bottom: 20px;
    }

    h2 {
      font-size: 24px;
      margin-bottom: 15px;
    }

    h3 {
      font-size: 20px;
      margin-bottom: 10px;
    }

    /* Thẻ đoạn văn bản */
    p {
      margin: 0px;
      font-size: 16px;
    }

    /* Thẻ hình ảnh */
    img {
      max-width: 100%;
      height: auto;
      margin: 15px 0;
    }

    /* Thẻ liên kết */
    a {
      color: #007bff;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    /* Thẻ danh sách */
    ul,
    ol {
      margin-left: 30px;
    }

    /* Thẻ chèn code */
    code {
      background-color: #f0f0f0;
      padding: 2px 5px;
      border-radius: 3px;
    }

    /* Kiểu cho phần mã code */
    pre {
      background-color: #f8f8f8;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      overflow-x: auto;
    }

    /* Tô đậm cho từ khóa trong phần mã code */
    pre code .keyword {
      font-weight: bold;
      color: #007bff;
    }

    /* Tô sáng cho comment trong phần mã code */
    pre code .comment {
      color: #6a9955;
    }

    /* Thẻ blockquote */
    blockquote {
      margin: 0;
      padding: 10px;
      background-color: #f8f8f8;
      border-left: 3px solid #007bff;
    }

    /* Thẻ blockquote - style cho đoạn trích dẫn */
    blockquote p {
      font-style: italic;
    }

    /* Thẻ blockquote - style cho tác giả */
    blockquote footer {
      font-size: 12px;
      color: #777;
    }

    /* Thẻ dòng ngang */
    hr {
      border: 1px solid #ccc;
      margin: 20px 0;
    }

    /* Thẻ bôi đậm */
    strong {
      font-weight: bold;
    }

    /* Thẻ nghiêng */
    em {
      font-style: italic;
    }

    /* Thẻ giữ chỗ (placeholder) */
    placeholder {
      color: #777;
    }

    /* Thẻ hightlight */
    mark {
      background-color: #ff0;
      color: #333;
    }

    /* Thẻ kẻ bên */
    ins {
      text-decoration: underline;
    }

    /* Thẻ gạch bỏ */
    del {
      text-decoration: line-through;
    }
  }
`;

export const ArticlePageBannerStyled = styled.div``;

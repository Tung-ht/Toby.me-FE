import { styled } from 'styled-components';

export const ArticleEditorStyled = styled.div`
  max-width: 1000px;
  margin: 20px auto 0px;
  width: 100%;
  background: #ffffff;
  padding: 15px;
  border-radius: 8px;

  .loading-article {
    margin: 20px 0px;
  }

  .input-editor {
    margin: 0px;
    /* background: #ffffff; */
  }

  .input-label {
    font-weight: 600;

    &__required {
      color: #ff0000;
    }
  }
  .error-article-editor {
    color: #ff0000;
    font-size: 14px;
  }

  .quill-editor {
    .ql-container {
      min-height: 500px;
      font-size: 16px;
    }
  }

  .container-button {
    margin-top: 12px;
    display: flex;
    justify-content: center;

    .editor-submit {
      color: #fff;

      &:focus {
        outline: none;
        border: none;
      }
    }
  }

  .MuiOutlinedInput-root {
    /* height: 56px; */
  }
`;

import { styled } from 'styled-components';

export const ArticleEditorStyled = styled.div`
  width: 100%;

  .input-editor {
    margin: 0px;
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
`;

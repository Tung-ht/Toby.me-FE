import { styled } from 'styled-components';

export const AuthStyled = styled.div`
  .input-auth {
    input {
      font-size: 18px;
      font-weight: 500;
    }
  }

  .error-auth {
    color: #ff0000;
    padding-left: 12px;
  }

  .wrapper-btn-auth {
    display: flex;
    justify-content: center;

    .btn-auth {
      color: #fff;
      font-weight: 500;
      text-transform: none;
      font-size: 18px;
      margin: 0px 4px;

      &:focus {
        border: none;
        outline: none;
      }

      &__outlined {
        color: #4caf50;
      }
    }
  }

  .auth-note {
    padding: 14px;
    border-radius: 8px;
    background-color: #f1f1f1;
    margin: 12px 0px;
  }
`;
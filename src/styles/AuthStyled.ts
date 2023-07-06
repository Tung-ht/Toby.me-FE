import { styled } from 'styled-components';

export const AuthStyled = styled.div`
  background: #f0f2f5;
  margin-top: -24px;

  .wrapper-auth {
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    border-radius: 4px;
    margin-top: 30px;
    background: #ffffff;
  }

  .input-auth {
    input,
    textarea {
      font-size: 18px !important;
      font-weight: 500;
    }
  }

  .input-number {
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
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

import { styled } from 'styled-components';

export const ArticlesTabSetStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  padding: 10px 20px;
  background-color: #ffffff;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
`;

export const TabStyled = styled.div`
  margin-right: 6px;
  padding: 8px 4px;
  cursor: pointer;
  font-weight: 600;

  .tab-title {
    opacity: 0.7;
    position: relative;
    transition: all 0.3s ease;

    &:after {
      left: 0;
      width: 0;
      height: 2px;
      content: '';
      bottom: -8px;
      display: block;
      position: absolute;
      background-color: #009300;
      transition: all 0.3s ease;
    }

    &:hover:after {
      width: 100%;
    }

    &:hover {
      color: #009300;
      opacity: 1;
    }

    &.active-tab {
      color: #009300;
      opacity: 1;
    }

    &.active-tab:after {
      width: 100%;
    }
  }

  /* &:hover {
    border-bottom: 3px solid #009300;
    color: #009300;
  }

  &.active-tab {
    border-bottom: 3px solid #009300;
    color: #009300;
  } */
`;

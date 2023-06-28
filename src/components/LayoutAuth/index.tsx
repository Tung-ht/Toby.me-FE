import React from 'react';
import { styled } from 'styled-components';
import logo from '../../imgs/tobyme.png';
import thumbAuth1 from '../../imgs/thumb-auth-1.png';

interface LayoutAuthProps {
  children: JSX.Element | JSX.Element[];
}

function LayoutAuth(props: LayoutAuthProps) {
  return (
    <LayoutAuthStyled>
      <div className='layout-left'>
        <div className='wrapper-brand'>
          <img className='logo' src={logo} />
          <h1 className='title'>Toby.me</h1>

          <p className='desc'>Cùng nhau chia sẻ kiến thức lập trình tới cộng đồng</p>

          <img className='thumb-auth' src={thumbAuth1} />
        </div>
      </div>
      <div className='layout-right'>
        <div className='wrapper-brand-sp'>
          <img className='logo' src={logo} />
          <h1 className='title'>Toby.me</h1>
        </div>

        {props.children}
      </div>
    </LayoutAuthStyled>
  );
}

export default LayoutAuth;

const LayoutAuthStyled = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: auto;

  .layout-left {
    width: 60%;
    height: 100%;
    background: #116d6e;

    .wrapper-brand {
      display: flex;
      flex-direction: column;
      align-items: center;

      .title {
        color: #5cb85c !important;
        font-weight: 600;
        font-size: 85px;
      }

      .logo {
        margin: 0px auto;
      }

      .desc {
        color: #fff;
        font-size: 20px;
      }

      .thumb-auth {
        width: 100%;
      }
    }
  }

  .layout-right {
    width: 40%;
    height: 100%;
    padding: 25px;

    .wrapper-brand-sp {
      display: none;
    }
  }

  @media screen and (max-width: 920px) {
    .layout-left {
      display: none;
    }

    .layout-right {
      width: 100%;

      .wrapper-brand-sp {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
`;

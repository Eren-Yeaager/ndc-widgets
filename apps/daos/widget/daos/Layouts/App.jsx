const Theme = styled.div`
  position: fixed;
  inset: 73px 0px 0px;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-style: normal;

  select {
    cursor: pointer;
  }

  a {
    color: inherit;
    font-weight: 500;

    &.color-text {
      background: linear-gradient(
        270deg,
        rgb(246 112 85) 1%,
        rgb(180 102 248) 50%,
        rgb(82 129 249) 99.83%
      );

      &.color-dark {
        background: linear-gradient(
          270deg,
          #efdcd1 -1.69%,
          #e0c6f7 43.78%,
          #adc3fb 99.83%
        );
      }
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .profile-info {
    color: inherit;
    font-size: 16px;
    margin-left: 5px;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #151718;
  }

  h1 {
    font-weight: 600;
  }

  img {
    width: 100%;
  }

  .btn-primary,
  .btn-secondary {
    background: #59e692;
    color: #000;
    border-radius: 40px;
    height: 40px;
    padding: 0 35px;
    font-weight: 600;
    font-size: 14px;
    border: none;
    cursor: pointer;
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    transition:
      background 200ms,
      opacity 200ms;

    &:hover,
    &:focus {
      background: rgb(112 242 164);
      outline: none;
      text-decoration: none;
      color: #000;
    }

    &:disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    &.outlined {
      color: #11181c;
      background: #fbfcfd;
      border: 1px solid #d7dbdf;

      i {
        color: #7e868c;
      }

      &:hover,
      &:focus {
        background: #ecedee;
      }
    }

    &.invresed {
      color: #ffff;
      background: #000;
      border: 1px solid #000;

      i {
        color: #fff;
      }

      &:hover,
      &:focus {
        background: #fff;
        color: #000;

        i {
          color: #000;
        }
      }
    }
  }

  .btn-secondary {
    color: #11181c;
    background: #f1f3f5;

    &:hover,
    &:focus {
      background: #d7dbde;
      outline: none;
    }
  }
`;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 768px) {
    overflow-x: hidden;
  }

  .btn-sm {
    padding: 5px 10px 5px 20px;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
  }

  a.dao-btn {
    font-size: 24px;
    transition: all 0.3s ease;
    border-radius: 50px;
    border: 3px solid black;
    padding: 15px 40px;
    text-align: center;
    margin-bottom: 2rem;

    &:hover {
      text-decoration: none;
    }
  }

  .red {
    color: rgb(255 141 141);
  }

  .blue {
    color: rgb(146 168 210);
  }

  @keyframes scroll {
    0% {
      transform: translate(0%);
    }
    100% {
      transform: translate(-100%);
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0 3rem 0;

  @media screen and (max-width: 786px) {
    width: 100%;
  }
`;

function AppLayout({ page, props, children }) {
  return (
    <Theme>
      <Container>
        <Widget src={`/*__@replace:widgetPath__*/.Components.NavBar`} />
        {["home", "dao", "communities"].includes(page) ? (
          children
        ) : (
          <Wrapper className="container-xl">{children}</Wrapper>
        )}
        <Widget
          src={`/*__@replace:widgetPath__*/.Components.Footer`}
          props={{ page }}
        />
      </Container>
    </Theme>
  );
}

return { AppLayout };

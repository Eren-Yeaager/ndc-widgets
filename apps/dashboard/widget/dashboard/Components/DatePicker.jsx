const { handleChange, period } = props;

const Loading = () => <Widget src="flashui.near/widget/Loading" />;

const code = `
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.umd.min.js"></script>
    <style>
    input {
      display: flex;
      color: #3F3F3F;
      font-size: 16px;
      font-style: normal;
      font-weight: 350;
      line-height: 16px;
      width: 100%;
      height: 46px;
      padding: 0px 14px 0px 16px;
      justify-content: space-between;
      align-items: center;
      border-radius: 100px;
      border: 1px solid #e3e3e0;
      background: var(--NEAR-Primary-Colors-White, #fff);
    }

    .wrapper {
      display: flex;
      justify-content: flex-end;
    }

    .icon {
      position: absolute;
      top: 22px;
      right: 30px;
      z-index: 1001;
      background: #FFF;
      display: flex;
    }

    .preset-plugin-container{
      background: #fff;
    }
    </style>
  </head>

  <body>
    <div class="wrapper">
      <input id="datepicker"/>
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M16.25 2.5H14.375V1.875C14.375 1.70924 14.3092 1.55027 14.1919 1.43306C14.0747 1.31585 13.9158 1.25 13.75 1.25C13.5842 1.25 13.4253 1.31585 13.3081 1.43306C13.1908 1.55027 13.125 1.70924 13.125 1.875V2.5H6.875V1.875C6.875 1.70924 6.80915 1.55027 6.69194 1.43306C6.57473 1.31585 6.41576 1.25 6.25 1.25C6.08424 1.25 5.92527 1.31585 5.80806 1.43306C5.69085 1.55027 5.625 1.70924 5.625 1.875V2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM5.625 3.75V4.375C5.625 4.54076 5.69085 4.69973 5.80806 4.81694C5.92527 4.93415 6.08424 5 6.25 5C6.41576 5 6.57473 4.93415 6.69194 4.81694C6.80915 4.69973 6.875 4.54076 6.875 4.375V3.75H13.125V4.375C13.125 4.54076 13.1908 4.69973 13.3081 4.81694C13.4253 4.93415 13.5842 5 13.75 5C13.9158 5 14.0747 4.93415 14.1919 4.81694C14.3092 4.69973 14.375 4.54076 14.375 4.375V3.75H16.25V6.25H3.75V3.75H5.625ZM16.25 16.25H3.75V7.5H16.25V16.25Z" fill="#1B1B18"/>
        </svg>
      </div>
    </div>
  </body>

  <script>
    const picker = new easepick.create({
      element: "#datepicker",
      css: [
          "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css"
      ],
      zIndex: 10,
      calendars: 2,
      grid: window.innerWidth < 500 ? 1 : 2,
      date: null,
      autoApply: true,
      plugins: [
        "AmpPlugin",
        "RangePlugin",
        "PresetPlugin"
      ],
      AmpPlugin: {
          resetButton: true,
          darkMode: false
      },
      PresetPlugin: {
        position: window.innerWidth < 768 ? "top" : "right"
      },
      setup(picker) {
        picker.on('select', (e) => {
          let startDate =  picker.getStartDate('DD MMM YYYY');
          let endDate =  picker.getEndDate('DD MMM YYYY');
          window.top.postMessage({ startDate, endDate }, "*");
        });
      }
    });
  </script>
</html>
`;

const Container = styled.div`
  position: relative;
  width: 100%;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  z-index: 1000;
  top: -7px;
  height: 350px;

  @media screen and (max-width: 768px) {
    height: 100%;
    height: 700px;
  }

  iframe {
    width: 100%;
    height: 100%;
  }
`;
console.log(period);
return (
  <Container>
    <Wrapper>
      <iframe srcDoc={code} onMessage={handleChange} message={""} />
    </Wrapper>
  </Container>
);

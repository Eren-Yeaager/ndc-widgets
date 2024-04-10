const { data, key } = props;

const Card = styled.div`
  background: ${(props) => (props.isWhiteBackground ? "#000000" : "#fffff")};
  width: 100%;
  text-align: center;
`;

const Loading = () => <Widget src="flashui.near/widget/Loading" />;

const chartData = props.chartData ?? {
  labels: data.map((item) => item.day),
  datasets: [
    {
      backgroundColor: gradient,
      data: data.map((item) => item[key]),
    },
  ],
};

const code = `
<html>
<head>
<script src="https://unpkg.com/chart.js@4.3.0/dist/chart.umd.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.6/iframeResizer.contentWindow.js"></script>
</head>
<body>
<canvas id="myChart"></canvas>
</body>
<script>
  const ctx = document.getElementById('myChart').getContext('2d');
  var gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0.7, '#A39ACD');
  gradient.addColorStop(0, '#5398DD');

 var formatNumber = (num)  => {
     if (num >= 1e9) { // For billions
         return (num % 1e9 === 0 ? (num / 1e9).toFixed(0) : (num / 1e9).toFixed(1)) + 'b';
     }
     if (num >= 1e6) { // For millions
         return (num % 1e6 === 0 ? (num / 1e6).toFixed(0) : (num / 1e6).toFixed(1)) + 'm';
     }
     if (num >= 1e3) { // For thousands
         return (num % 1e3 === 0 ? (num / 1e3).toFixed(0) : (num / 1e3).toFixed(1)) + 'k';
     }
     return num.toString(); // For numbers less than 1000
 }

    function createChart(ctx, data, options) {
        new Chart(ctx, {
            data: {
                  labels: data.labels,
                  datasets: [{
                        data: data.datasets[0].data,
                        backgroundColor: gradient,
                        borderWidth: 0
                    }]      
            },
            type: "bar",
            options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              },
            },
            scales: {
              x: {
                grid: {
                  display: false
                }
              },
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value, index, values) {
                             return formatNumber(value);
                  },
                  font: {
                    weight: '750',
                    size: '15px'
                  }
                },
                grid: {
                  display: false
                }
              }
            }
          }
        });
    }

    window.addEventListener('message', function(event) {
    }, false);

    const handleMessage = (m) => {
        const { data, options } = m;
        
        createChart(ctx, data, options);
    };

    window.iFrameResizer = {
        onMessage: handleMessage
    }
</script>
</html>
`;

return (
  <div className="section py-5">
    <Card>
      <div>{props.title}</div>
      {props.loading ? (
        <div className="w-100 py-5 d-flex justify-content-center align-items-center">
          <Loading />
        </div>
      ) : chartData.datasets[0].data.length ? (
        <iframe iframeResizer srcDoc={code} message={{ data: chartData }} />
      ) : (
        <div
          className="w-100 py-5 d-flex justify-content-center align-items-center"
          style={{ fontSize: "60px" }}
        >
          n/a
        </div>
      )}
    </Card>
  </div>
);

import React from "react"
import ReactApexChart from 'react-apexcharts'

class CircleChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      series: this.props.series,
      options: {
        chart: {
          height: 350,
          type: 'radialBar',
        },
        colors: this.props.colors,
        plotOptions: {
          radialBar: {
            dataLabels: {
              show: true,
              name: {
                fontSize: '22px',
              },
              value: {
                show: true,
                fontSize: '16px',
              },
              total: {
                show: true,
                label: this.props.label,
                color: this.props.labelColor,
                fontSize: '10px',
                fontWeight: 600,
                formatter: function (w) {
                  return ''
                }
              }
            }
          }
        },
        labels: this.props.labels,
      },
    };
  }

  render() {
    return (
      <div id="chart" style={ this.props.isTransperent ? {opacity: 0.5} : null }>
        <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={350} />
      </div>
    )
  }
}

export default CircleChart;

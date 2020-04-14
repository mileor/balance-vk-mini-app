import React from "react"
import ReactApexChart from 'react-apexcharts'

class BarChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      series: [{
        name: 'Спорт',
        data: this.props.sportData,
      }, {
        name: 'Питание',
        data: this.props.foodData
      }, {
        name: 'Интеллект',
        data: this.props.mindData
      }, {
        name: 'Эмоции',
        data: this.props.emotionData
      }, {
        name: 'Другие задачи',
        data: this.props.otherData
      }],
      options: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        stroke: {
          width: 2,
          colors: ['#fff']
        },
        xaxis: {
          categories: ['Сегодня', 'Вчера', '20 марта', '19 марта', '18 марта', '17 марта', '16 марта'],
        },
        yaxis: {
          show: false,
          showAlways: false,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + "%"
            }
          }
        },
        colors: ['#3f8ae0', '#4bb34b', '#ffa000', '#792ec0', '#00b8d9'],
        legend: {
          show: false
        }
      },
    };
  }

  lastDaysRender = () => {
    let monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return '0123456'.split('').map(function (n) {
      let d = new Date();
      d.setDate(d.getDate() - n);

      return (function (day, month) {
        return [day < 10 ? day : day, month < 10 ? monthNames[month] : monthNames[month]].join(' ');
      })(d.getDate(), d.getMonth());
    });
  }

  lastDaysRenderWithWords = () => {
    let days = this.lastDaysRender();
    days[0] = 'Сегодня';
    days[1] = 'Вчера';
    return days
  }

  componentDidMount = () => {
    let datesArr = this.lastDaysRenderWithWords();
    this.setState({
      ...this.state, options: {
        ...this.state.options, xaxis: {
          categories: datesArr,
        }
      }
    })
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />
      </div>
    )
  }
}

export default BarChart;

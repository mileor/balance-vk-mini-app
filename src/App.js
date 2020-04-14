import React from 'react';
import {
  Epic, Root, View, Tabbar, TabbarItem, Panel, PanelHeader, Button, Div, Group,
  PanelHeaderButton, PanelHeaderSimple, Header, FixedLayout, List, Cell, Placeholder,
  FormStatus, FormLayout
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import './App.css';

import AddCardGridItem from './components/AddCardGridItem';
import EditCardGridItem from './components/EditCardGridItem';
import BalanceCardGridItem from './components/BalanceCardGridItem';
import FormLayoutContainer from './components/FormLayoutContainer';
import CircleChart from './components/CircleChart'
import BarChart from './components/BarChart'

import Icon28WriteOutline from '@vkontakte/icons/dist/28/write_outline';
import Icon28PollSquareOutline from '@vkontakte/icons/dist/28/poll_square_outline';
import Icon28SmileOutline from '@vkontakte/icons/dist/28/smile_outline';
import Icon16Add from '@vkontakte/icons/dist/16/add';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon24Delete from '@vkontakte/icons/dist/24/delete';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';
import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStory: 'main',
      activeView: 'mainView',
      activePanel: 'addGoals',
      userGoalsData: {
        sport: [],
        food: [],
        mind: [],
        emotion: [],
        other: [],
      },
      defaultGoalsData: {
        sport: [
          { name: 'Отжимания', typeOfCalculation: 'count', amount: 10 },
          { name: 'Тренировка', typeOfCalculation: 'timePeriod', duration: 30 },
          { name: 'Зарядка', typeOfCalculation: 'timePeriod', duration: 10 },
        ],
        food: [
          { name: 'Пить воду', typeOfCalculation: 'count', amount: 8 },
          { name: 'Есть свежие фрукты и овощи', typeOfCalculation: 'count', amount: 5 },
          { name: 'День без сладостей', typeOfCalculation: 'count', amount: 1 },
        ],
        mind: [
          { name: 'Чтение', typeOfCalculation: 'timePeriod', duration: 20 },
          { name: 'Изучение английского', typeOfCalculation: 'timePeriod', duration: 15 },
          { name: 'Повышение проф.скиллов', typeOfCalculation: 'timePeriod', duration: 15 },
        ],
        emotion: [
          { name: 'Медитация', typeOfCalculation: 'timePeriod', duration: 10 },
          { name: 'Планирование дня', typeOfCalculation: 'count', amount: 1 },
          { name: 'Заниматься хобби', typeOfCalculation: 'timePeriod', duration: 20 },
          { name: 'Записать мысли в дневник', typeOfCalculation: 'count', amount: 1 },
        ]
      },
      activeEditGoal: {
        goalData: { name: '', typeOfCalculation: '', duration: 1, amount: 1, complete: 0 },
        goalType: '',
      },
      activeStartGoal: {
        goalData: { name: '', typeOfCalculation: '', duration: 1, amount: 1, complete: 0 },
        goalType: '',
      },
      isRemoveMode: false,
      goalsColors: {
        sport: '#3f8ae0',
        food: '#4bb34b',
        mind: '#ffa000',
        emotion: '#792ec0',
        other: '#00b8d9'
      },
      isFormError: false,
      lastDate: {
        currentDay: 0,
        currentMonth: 0,
      },
    };

    this.onStoryChange = this.onStoryChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeGoalType = this.onChangeGoalType.bind(this);
  }

  onStoryChange(e) {
    this.setState({ activeStory: e.currentTarget.dataset.story })
  }

  onChange(event) {
    const { name, value } = event.currentTarget;
    this.setState({
      activeEditGoal: {
        ...this.state.activeEditGoal,
        goalData: { ...this.state.activeEditGoal.goalData, [name]: value.replace(',', '').replace('.', '') }
      }
    });
  }

  onChangeGoalType(event) {
    this.setState({
      activeEditGoal: {
        ...this.state.activeEditGoal,
        goalType: event.target.value
      }
    })
  }

  componentDidUpdate() {
    const currentDate = new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();
    window.localStorage.setItem(currentDate, JSON.stringify(this.state));
  }

  componentDidMount() {
    const currentDate = new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();
    const userGoalsFromStorage = JSON.parse(window.localStorage.getItem('userGoals'));

    if (userGoalsFromStorage) {
      const userGoalsFromStorageToday = JSON.parse(window.localStorage.getItem(currentDate));

      if (userGoalsFromStorageToday) {
        // пользователь сегодня пользовался приложением
        this.setState({ ...this.state, userGoalsData: userGoalsFromStorageToday.userGoalsData });
      } else {
        // пользователь сегодня не пользовался приложением
        this.setState({ ...this.state, userGoalsData: userGoalsFromStorage });
      }
    } else {
      // пользователь ни разу не пользоваться приложением
    }

    this.interval = setInterval(() => this.setCurrentDate(), 10000);

  }

  setCurrentDate = () => {
    let currentDate = new Date();
    let currentDay = currentDate.getDate();
    let currentMonth = currentDate.getMonth() + 1;
    this.setState({
      lastDate: {
        currentDay: currentDay,
        currentMonth: currentMonth,
      }
    })
  }

  renderDefaultGoalsData = (goalsArray, goalType) => {
    return goalsArray.map((item, index) => {
      return (
        <AddCardGridItem
          cardName={item.name}
          key={index}
          onClick={() => this.setState({
            activePanel: 'addGoalItem',
            activeEditGoal: {
              ...this.state.activeEditGoal,
              goalData: { ...this.state.activeEditGoal.goalData, ...goalsArray[index] },
              goalType: goalType,
              key: index,
            },
          })}
        />
      )
    })
  }

  isGoalDone = (goalType, index) => {
    return (this.state.userGoalsData[goalType][index].typeOfCalculation === 'timePeriod' &&
      this.state.userGoalsData[goalType][index].complete >= this.state.userGoalsData[goalType][index].duration) ||
      (this.state.userGoalsData[goalType][index].typeOfCalculation === 'count' &&
        this.state.userGoalsData[goalType][index].complete >= this.state.userGoalsData[goalType][index].amount)
  }

  countCardProgressValue = (item) => {

    if (item.typeOfCalculation === 'count') {
      return Math.ceil((item.complete / item.amount) * 100) + '%'
    } else {
      return Math.ceil((item.complete / item.duration) * 100) + '%'
    }

  }

  renderCurrentGoalsDataBalance = (goalsArray, goalType) => {
    return goalsArray.map((item, index) => {
      return (

        <BalanceCardGridItem
          cardName={item.name}
          key={index}
          isDone={
            this.isGoalDone(goalType, index)
          }
          cardProgressColor={this.state.goalsColors[goalType]}
          cardProgressValue={item.complete ? this.countCardProgressValue(item) : '0%'}
          onClick={() => this.setState({
            activeView: 'modalView',
            activePanel: 'startGoalItem',
            activeStartGoal: {
              ...this.state.activeStartGoal,
              goalData: { ...this.state.activeStartGoal.goalData, ...goalsArray[index] },
              goalType: goalType,
              key: index,
            },
          })}
        />
      )
    })
  }

  renderCurrentGoalsData = (goalsArray, goalType) => {
    return goalsArray.map((item, index) => {
      return (
        <EditCardGridItem
          cardName={item.name}
          key={index}
          isRemovable={this.state.isRemoveMode}
          onRemove={() => this.setState({
            userGoalsData: {
              ...this.state.userGoalsData,
              [goalType]: [
                ...this.state.userGoalsData[goalType].slice(0, index),
                ...this.state.userGoalsData[goalType].slice(index + 1)
              ],
            },
          }, function () {
            if (!this.isRenderUserGoals(this.state.userGoalsData)) this.setState({ isRemoveMode: false })
          })}
          onClick={() => this.setState({
            activePanel: 'editGoalItem',
            activeView: 'modalView',
            activeEditGoal: {
              ...this.state.activeEditGoal,
              goalData: { ...this.state.activeEditGoal.goalData, ...goalsArray[index] },
              goalType: goalType,
              key: index,
            },
          })}
        />
      )
    })
  }

  storeUserGoals = () => {
    const newUserGoalData = JSON.parse(JSON.stringify(this.state.userGoalsData));
    for (let key in newUserGoalData) {
      newUserGoalData[key] = newUserGoalData[key].map(goal => {
        return goal = { ...goal, complete: 0 }
      })
    }

    window.localStorage.setItem('userGoals', JSON.stringify(newUserGoalData));
  }

  changeUserGoal = (e, mode) => {

    let newUserGoal = JSON.parse(JSON.stringify(this.state.activeEditGoal));
    let userGoalType = newUserGoal.goalType;
    newUserGoal.goalData.name = newUserGoal.goalData.name.trim()


    newUserGoal.goalData.typeOfCalculation === 'count'
      ? delete newUserGoal.goalData.duration
      : delete newUserGoal.goalData.amount;

    const names = [];
    for (let key in this.state.userGoalsData) {
      names.push(...this.state.userGoalsData[key].map(goal => goal.name))
    }

    if (names.includes(newUserGoal.goalData.name) && mode === 'new') {
      this.setState({ isFormError: true });
      return
    } else if (mode === 'new' && newUserGoal.goalData.name
      && (newUserGoal.goalData.amount > 0 || newUserGoal.goalData.duration > 0)) {
      newUserGoal.goalData.id = Math.random().toString(36).substr(2, 9);
      this.setState({
        userGoalsData: {
          ...this.state.userGoalsData,
          [userGoalType]: [
            ...this.state.userGoalsData[userGoalType],
            newUserGoal.goalData,
          ],
        },
        activeEditGoal: {
          goalData: { name: '', typeOfCalculation: '', duration: 1, amount: 1, complete: 0 },
          goalType: '',
        },
        activeView: 'mainView',
        isFormError: false
      }, () => {
        this.storeUserGoals();
      });
    } else if (mode === 'edit' && newUserGoal.goalData.name
      && (newUserGoal.goalData.amount > 0 || newUserGoal.goalData.duration > 0)
    ) {

      let targetCategoryKey = ''

      for (let key in this.state.userGoalsData) {
        let names = this.state.userGoalsData[key].map(goal => goal.name)

        for (let name of names) {
          if (newUserGoal.goalData.name === name) {
            targetCategoryKey = key
          }
        }
      }

      if (!targetCategoryKey) {
        for (let key in this.state.userGoalsData) {
          let identifiator = this.state.userGoalsData[key].map(goal => goal.id);

          for (let id of identifiator) {
            if (newUserGoal.goalData.id === id) {
              targetCategoryKey = key
            }
          }
        }
      }


      this.setState({
        userGoalsData: {
          ...this.state.userGoalsData,
          [targetCategoryKey]: [
            ...this.state.userGoalsData[targetCategoryKey].slice(0, newUserGoal.key),
            ...this.state.userGoalsData[targetCategoryKey].slice(newUserGoal.key + 1)
          ],
        },

        activeEditGoal: {
          goalData: { name: '', typeOfCalculation: '', duration: 1, amount: 1, complete: 0 },
          goalType: '',
        },
        activeView: 'mainView',
        isFormError: false
      }, () => {
        if (targetCategoryKey === userGoalType) {
          this.setState({
            userGoalsData: {
              ...this.state.userGoalsData,
              [userGoalType]: [
                ...this.state.userGoalsData[userGoalType].slice(0, newUserGoal.key),
                newUserGoal.goalData,
                ...this.state.userGoalsData[userGoalType].slice(newUserGoal.key + 1)
              ],
            }
          });
        } else {
          this.setState({
            userGoalsData: {
              ...this.state.userGoalsData,
              [userGoalType]: [
                ...this.state.userGoalsData[userGoalType],
                newUserGoal.goalData,
              ],
            }
          });
        }
        this.storeUserGoals();
      });
    }
  }

  completeUserGoal = () => {
    let newUserGoal = JSON.parse(JSON.stringify(this.state.activeStartGoal));
    let userGoalType = newUserGoal.goalType;

    if (newUserGoal.goalData.typeOfCalculation === 'count') {
      if (newUserGoal.goalData.complete < newUserGoal.goalData.amount) {
        newUserGoal.goalData.complete = newUserGoal.goalData.amount
      }
    } else {
      if (newUserGoal.goalData.complete < newUserGoal.goalData.duration) {
        newUserGoal.goalData.complete = newUserGoal.goalData.duration
      }
    }
    this.setState({
      userGoalsData: {
        ...this.state.userGoalsData,
        [userGoalType]: [
          ...this.state.userGoalsData[userGoalType].slice(0, newUserGoal.key),
          newUserGoal.goalData,
          ...this.state.userGoalsData[userGoalType].slice(newUserGoal.key + 1)
        ],
      },
      activeStartGoal: {
        goalData: { name: '', typeOfCalculation: '', duration: 1, amount: 1, complete: 0 },
        goalType: '',
      },
      activeView: 'mainView'
    });
  }

  completeUserGoalBack = () => {
    let newUserGoal = JSON.parse(JSON.stringify(this.state.activeStartGoal));
    let userGoalType = newUserGoal.goalType;

    this.setState({
      userGoalsData: {
        ...this.state.userGoalsData,
        [userGoalType]: [
          ...this.state.userGoalsData[userGoalType].slice(0, newUserGoal.key),
          newUserGoal.goalData,
          ...this.state.userGoalsData[userGoalType].slice(newUserGoal.key + 1)
        ],
      },
      activeStartGoal: {
        goalData: { name: '', typeOfCalculation: '', duration: 1, amount: 1, complete: 0 },
        goalType: '',
      },
      activeView: 'mainView'
    });
  }

  isRenderUserGoals = (data) => {
    let length = 0;
    if (Array.isArray(data)) {
      if (data.length > length) {
        length = data.length
      }
    } else {
      for (let item in data) {
        if (data[item].length > length) {
          length = data[item].length
        }
      }
    }
    return length;
  }

  renderChartData = (goalsObj) => {
    let goalsTitle = {
      sport: 'Спорт',
      food: 'Питание',
      mind: 'Интеллект',
      emotion: 'Эмоции',
      other: 'Другие задачи',
    }
    let data = [];
    for (let item in goalsObj) {
      if (goalsObj[item].length > 0) {
        data.push({
          title: goalsTitle[item],
          value: goalsObj[item].length,
          color: this.state.goalsColors[item]
        })
      }
    }
    return data;
  }

  countOfGoals = (goalsObg) => {
    let count = 0;
    for (let item in goalsObg) {
      if (goalsObg[item].length > 0) {
        count++
      }
    }
    return count
  }

  goalsNames = (goalsObg) => {
    let goalsTitle = {
      sport: 'Спорт',
      food: 'Питание',
      mind: 'Интеллект',
      emotion: 'Эмоции',
      other: 'Другие задачи',
    }
    let goalsNamesData = [];
    for (let item in goalsObg) {
      if (goalsObg[item].length > 0) {
        goalsNamesData.push(goalsTitle[item])
      }
    }
    return goalsNamesData
  }

  goalsColors = (goalsObg) => {
    let goalsColorsData = [];
    for (let item in goalsObg) {
      if (goalsObg[item].length > 0) {
        goalsColorsData.push(this.state.goalsColors[item])
      }
    }
    return goalsColorsData
  }

  goalsProgress = (goalsObj) => {
    let goalsProgressData = [];

    for (let sphere in goalsObj) {
      if (goalsObj[sphere].length > 0) {
        let completedPercents = goalsObj[sphere].map((goal) => {

          if (!goal.complete) {
            return 0;
          }

          if (goal.typeOfCalculation === 'count') {
            return goal.complete / goal.amount * 100;
          }
          if (goal.typeOfCalculation === 'timePeriod') {
            return goal.complete / goal.duration * 100;
          }

          return 0;
        }, [])

        let averagePercent = completedPercents.reduce((a, b) => a + b, 0) / completedPercents.length;

        goalsProgressData.push(Math.ceil(averagePercent))

      }
    }

    return goalsProgressData
  }

  isBalanceReached = () => {
    let goalsProgressArray = this.goalsProgress(this.state.userGoalsData);
    return goalsProgressArray.filter(item => item < 100).length === 0
  }

  renderStatisticData = (index) => {
    let result = [];
    for (let i = 0; i < 7; i++) {
      const currenDate = new Date();
      currenDate.setDate(currenDate.getDate() - i);
      let targetDate = currenDate.getDate() + "/" + (currenDate.getMonth() + 1) + "/" + currenDate.getFullYear();
      try {
        const state = window.localStorage.getItem(targetDate);
        if (state) {
          let userData = JSON.parse(state).userGoalsData;
          let goalsProgressData = [];

          for (let sphere in userData) {
            if (userData[sphere].length === 0) {
              goalsProgressData.push(0 + '%')
              continue
            }
            let completedPercents = userData[sphere].map((goal) => {

              if (!goal.complete) {
                return 0 + '%';
              }

              if (goal.typeOfCalculation === 'count') {
                return goal.complete / goal.amount * 100;
              }
              if (goal.typeOfCalculation === 'timePeriod') {
                return goal.complete / goal.duration * 100;
              }

              return 0 + '%';
            }, [])

            let averagePercent = completedPercents.reduce((a, b) => a + b, 0) / completedPercents.length;

            goalsProgressData.push(Math.ceil(averagePercent) + "%")

          }
          result.push(goalsProgressData)
        } else {
          result.push(['0%', '0%', '0%', '0%', '0%'])
        }
      } catch (e) {
        console.log(e)
      }
    }

    let targetArr = [];

    for (let i = 0; i < result.length; i++) {
      targetArr.push(result[i][index])
    }
    return targetArr
  }

  render() {

    return (
      <Root activeView={this.state.activeView}>
        <Epic id="mainView" activeStory={this.state.activeStory} tabbar={

          <Tabbar>
            <TabbarItem
              onClick={this.onStoryChange}
              selected={this.state.activeStory === 'main'}
              data-story="main"
              text="Баланс"
            ><Icon28SmileOutline /></TabbarItem>
            <TabbarItem
              onClick={this.onStoryChange}
              selected={this.state.activeStory === 'settings'}
              data-story="settings"
              text="Редактировать цели"
            ><Icon28WriteOutline /></TabbarItem>
            <TabbarItem
              onClick={this.onStoryChange}
              selected={this.state.activeStory === 'statistics'}
              data-story="statistics"
              text="Статистика"
            ><Icon28PollSquareOutline /></TabbarItem>
          </Tabbar>
        }>


          <View id="main" activePanel="main">

            <Panel id="main">

              <PanelHeader>Баланс</PanelHeader>
              {
                this.isRenderUserGoals(this.state.userGoalsData) ?

                  <Group style={{ paddingBottom: 60 }}>

                    <CircleChart
                      labels={this.goalsNames(this.state.userGoalsData)}
                      colors={this.goalsColors(this.state.userGoalsData)}
                      series={this.goalsProgress(this.state.userGoalsData)}
                      label={this.isBalanceReached() ? 'Баланс достигнут!' : 'Заполяйте, достигая цели'}
                      labelColor={this.isBalanceReached() ? '#4bb34b' : "gray"}
                    />

                    {
                      this.isBalanceReached() ?
                        <Div
                          style={{ textAlign: "center", fontSize: 24, fontWeight: 500 }}
                        >
                          <span
                            role="img"
                            aria-labelledby="like"
                            style={{ paddingBottom: 16, fontSize: 60 }}
                          >
                            🎉
                          </span><br />
                          Поздравляем, баланс на сегодня достигнут!
                      </Div>
                        : <Div style={{ fontSize: 20, fontWeight: 500 }}>Ваши цели на сегодня:</Div>

                    }

                    {
                      this.isRenderUserGoals(this.state.userGoalsData.sport) ?
                        <div>
                          <Group
                            header={<Header mode="secondary"><span role="img" aria-labelledby="sport" style={{ fontSize: 16, paddingRight: 4 }} >👟</span>Спорт</Header>}
                          >
                            <List>
                              {this.renderCurrentGoalsDataBalance(this.state.userGoalsData.sport, 'sport')}
                            </List>
                          </Group>
                        </div>
                        : null
                    }

                    {
                      this.isRenderUserGoals(this.state.userGoalsData.mind) ?
                        <div>
                          <Group
                            header={<Header mode="secondary"><span role="img" aria-labelledby="mind" style={{ fontSize: 16, paddingRight: 4 }} >📚</span>Интеллект</Header>}
                          >
                            {this.renderCurrentGoalsDataBalance(this.state.userGoalsData.mind, 'mind')}
                          </Group>
                        </div>
                        : null
                    }

                    {
                      this.isRenderUserGoals(this.state.userGoalsData.food) ?
                        <div>
                          <Group
                            header={<Header mode="secondary"><span role="img" aria-labelledby="food" style={{ fontSize: 16, paddingRight: 4 }} >🥦</span>Питание</Header>}
                          >
                            {this.renderCurrentGoalsDataBalance(this.state.userGoalsData.food, 'food')}
                          </Group>
                        </div>
                        : null
                    }

                    {
                      this.isRenderUserGoals(this.state.userGoalsData.emotion) ?
                        <div>
                          <Group
                            header={<Header mode="secondary"><span role="img" aria-labelledby="emotion" style={{ fontSize: 16, paddingRight: 4 }} >🍀</span>Эмоции</Header>}
                          >
                            {this.renderCurrentGoalsDataBalance(this.state.userGoalsData.emotion, 'emotion')}
                          </Group>
                        </div>
                        : null
                    }

                    {
                      this.isRenderUserGoals(this.state.userGoalsData.other) ?
                        <div>
                          <Group
                            header={<Header mode="secondary"><span role="img" aria-labelledby="other" style={{ fontSize: 16, paddingRight: 4 }} >✏️</span>Другие задачи</Header>}
                          >
                            <List>
                              {this.renderCurrentGoalsDataBalance(this.state.userGoalsData.other, 'other')}
                            </List>
                          </Group>
                        </div>
                        : null
                    }
                    <Div style={{ textAlign: "center", paddingTop: 24 }}>
                      <Button size="l" onClick={() => this.setState({ activeView: 'modalView', activePanel: 'addGoals' })}
                        before={<Icon16Add />}
                      >
                        Добавить цель</Button>
                    </Div>



                  </Group>

                  : <div>
                      <CircleChart
                        labels={this.goalsNames(this.state.defaultGoalsData)}
                        colors={this.goalsColors(this.state.defaultGoalsData)}
                        series={[100, 100, 100, 100]}
                        isTransperent={true}
                      />

                      <Placeholder
                        header="Это круг Вашего жизенного баланса"
                        action={<Button size="l" onClick={() => this.setState({ activeView: 'modalView', activePanel: 'addGoals' })}
                          before={<Icon16Add />}
                        >
                          Добавить цель</Button>}
                      >
                        Достигайте ежедневные цели, чтобы поддерживать равновесие между сферами жизни.
                      </Placeholder>
                    </div>
              }
            </Panel>
          </View>

          <View id="settings" activePanel="settings">
            <Panel id="settings">

              <PanelHeader>Редактирование</PanelHeader>

              {
                this.isRenderUserGoals(this.state.userGoalsData) ?

                  <Group style={{ paddingBottom: 56 }}>
                    <Group>
                      <List>
                        <Cell multiline>
                          Редактируйте текущие цели, и добавляйте новые.
                          Все Ваши цели представлены в списке ниже:
                        </Cell>
                      </List>
                    </Group>
                    {
                      this.isRenderUserGoals(this.state.userGoalsData.sport) ?
                        <div>
                          <Group
                            header={<Header mode="secondary"><span role="img" aria-labelledby="sport" style={{ fontSize: 16, paddingRight: 4 }} >👟</span>Спорт</Header>}
                            separator="show"
                          >
                            <List>
                              {this.renderCurrentGoalsData(this.state.userGoalsData.sport, 'sport')}
                            </List>
                          </Group>
                        </div>
                        : null
                    }

                    {
                      this.isRenderUserGoals(this.state.userGoalsData.mind) ?
                        <div>
                          <Group
                            header={<Header mode="secondary"><span role="img" aria-labelledby="mind" style={{ fontSize: 16, paddingRight: 4 }} >📚</span>Интеллект</Header>}
                            separator="show"
                          >
                            {this.renderCurrentGoalsData(this.state.userGoalsData.mind, 'mind')}
                          </Group>
                        </div>
                        : null
                    }

                    {
                      this.isRenderUserGoals(this.state.userGoalsData.food) ?
                        <div>
                          <Group
                            header={<Header mode="secondary"><span role="img" aria-labelledby="food" style={{ fontSize: 16, paddingRight: 4 }} >🥦</span>Питание</Header>}
                            separator="show"
                          >
                            {this.renderCurrentGoalsData(this.state.userGoalsData.food, 'food')}
                          </Group>
                        </div>
                        : null
                    }

                    {
                      this.isRenderUserGoals(this.state.userGoalsData.emotion) ?
                        <div>
                          <Group
                            header={<Header mode="secondary"><span role="img" aria-labelledby="emotion" style={{ fontSize: 16, paddingRight: 4 }} >🍀</span>Эмоции</Header>}
                            separator="show"
                          >
                            {this.renderCurrentGoalsData(this.state.userGoalsData.emotion, 'emotion')}
                          </Group>
                        </div>
                        : null
                    }

                    {
                      this.isRenderUserGoals(this.state.userGoalsData.other) ?
                        <div>
                          <Group
                            header={<Header mode="secondary"><span role="img" aria-labelledby="other" style={{ fontSize: 16, paddingRight: 4 }} >✏️</span>Другие задачи</Header>}
                            separator="show"
                          >
                            <List>
                              {this.renderCurrentGoalsData(this.state.userGoalsData.other, 'other')}
                            </List>
                          </Group>
                        </div>
                        : null
                    }

                  </Group>
                  : <Group>
                    <List>
                      <Cell multiline>
                        Добавьте себе цели для поддержания жизненного баланса
                        </Cell>
                    </List>
                  </Group>

              }

              <FixedLayout vertical="bottom">

                <Div style={{ display: 'flex' }} className="footer">
                  {
                    !this.state.isRemoveMode ?
                      <Button
                        stretched
                        style={{ marginRight: 8 }}
                        onClick={() => this.setState({ activeView: 'modalView', activePanel: 'addGoals' })}
                        before={<Icon16Add />}
                      >
                        Добавить цель
                      </Button>
                      : null
                  }
                  {
                    this.isRenderUserGoals(this.state.userGoalsData) ?
                      <Button
                        stretched
                        mode={this.state.isRemoveMode ? "secondary" : "destructive"}
                        style={{ marginRight: 8 }}
                        onClick={() => this.setState({ isRemoveMode: !this.state.isRemoveMode })}
                        before={this.state.isRemoveMode ? <Icon16CheckCircle /> : <Icon24Delete width={16} height={16} />}
                      >
                        {this.state.isRemoveMode ? 'Готово' : 'Режим удаления'}
                      </Button> :
                      null
                  }


                </Div>
              </FixedLayout>
            </Panel>
          </View>
          <View id="statistics" activePanel="statistics">
            <Panel id="statistics">
              <PanelHeader>Статистика</PanelHeader>
              <Group>
                <List>
                  <Cell multiline>
                    Просматривайте статистику по целям и сравнивайте продуктивность за различные дни!
                  </Cell>
                </List>
              </Group>

              <BarChart
                sportData={this.renderStatisticData(0)}
                foodData={this.renderStatisticData(1)}
                mindData={this.renderStatisticData(2)}
                emotionData={this.renderStatisticData(3)}
                otherData={this.renderStatisticData(4)}
              />
            </Panel>
          </View>

        </Epic>

        <Root id="modalView" activeView="addGoalsModal">
          <View header={false} activePanel={this.state.activePanel} id="addGoalsModal">
            <Panel separator={false} id="addGoals">
              <PanelHeaderSimple
                left={
                  <PanelHeaderButton onClick={() => this.setState({ activeView: 'mainView' })}>
                    <Icon24Cancel />
                  </PanelHeaderButton>
                }
              >
                Добавить цели
              </PanelHeaderSimple>
              <Group>
                <List>
                  <Cell multiline>Выберите новые цели из списка ниже или добавьте свои.</Cell>
                </List>
              </Group>
              <div style={{ paddingBottom: 80 }}>
                <div>
                  <Group
                    header={<Header mode="secondary"><span role="img" aria-labelledby="sport" style={{ fontSize: 16, paddingRight: 4 }} >👟</span>Спорт</Header>}
                    separator="show"
                  >

                    {this.renderDefaultGoalsData(this.state.defaultGoalsData.sport, 'sport')}
                  </Group>
                </div>

                <div>
                  <Group
                    header={<Header mode="secondary"><span role="img" aria-labelledby="mind" style={{ fontSize: 16, paddingRight: 4 }} >📚</span>Интеллект</Header>}
                    separator="show"
                  >
                    {this.renderDefaultGoalsData(this.state.defaultGoalsData.mind, 'mind')}
                  </Group>
                </div>

                <div>
                  <Group
                    header={<Header mode="secondary"><span role="img" aria-labelledby="food" style={{ fontSize: 16, paddingRight: 4 }} >🥦</span>Питание</Header>}
                    separator="show"
                  >
                    {this.renderDefaultGoalsData(this.state.defaultGoalsData.food, 'food')}
                  </Group>
                </div>

                <div>
                  <Group
                    header={<Header mode="secondary"><span role="img" aria-labelledby="emotion" style={{ fontSize: 16, paddingRight: 4 }} >🍀</span>Эмоции</Header>}
                    separator="show"
                  >
                    {this.renderDefaultGoalsData(this.state.defaultGoalsData.emotion, 'emotion')}
                  </Group>
                </div>
              </div>

              <FixedLayout vertical="bottom">
                <Div className="footer">

                  <Button
                    style={{ marginRight: 8 }}
                    size="xl"
                    onClick={() => this.setState({
                      activePanel: 'addGoalItem',
                      activeEditGoal: {
                        ...this.state.activeEditGoal,
                        goalData: { name: '', typeOfCalculation: 'timePeriod', duration: 1, amount: 1 },
                        goalType: 'other',
                      },
                    })}
                    before={<Icon16Add />}
                  >
                    Добавить свою цель
                  </Button>

                </Div>
              </FixedLayout>
            </Panel>

            <Panel separator={false} id="addGoalItem">
              <PanelHeaderSimple
                left={
                  <PanelHeaderButton onClick={() => this.setState({ activePanel: 'addGoals', isFormError: false })}>
                    <Icon24BrowserBack />
                  </PanelHeaderButton>
                }
              >
                {this.state.activeEditGoal.goalData.name}
              </PanelHeaderSimple>
              {
                this.state.isFormError ?
                  <FormLayout>
                    <FormStatus header="Цель с таким названием уже есть. Пожалуйста, придумайте другое название для этой цели" mode="error">
                    </FormStatus>
                  </FormLayout>
                  : null
              }
              {this.state.isFormError}
              <FormLayoutContainer
                goalNameValue={this.state.activeEditGoal.goalData.name}
                onChange={this.onChange}
                goalAchievementTypeValue={this.state.activeEditGoal.goalData.typeOfCalculation}
                goalCountValue={this.state.activeEditGoal.goalData.amount}
                goalDurationValue={this.state.activeEditGoal.goalData.duration}
                onChangeGoalType={this.onChangeGoalType}
                goalType={this.state.activeEditGoal.goalType}
              />

              <FixedLayout vertical="bottom">
                <Div>
                  <Button
                    size="xl"
                    onClick={(e) => this.changeUserGoal(e, 'new')}
                  >
                    Добавить в цели на день
                  </Button>
                </Div>
              </FixedLayout>
            </Panel>

            <Panel separator={false} id="editGoalItem">
              <PanelHeaderSimple
                left={
                  <PanelHeaderButton onClick={() => this.setState({ activeView: 'mainView', isFormError: false })}>
                    <Icon24BrowserBack />
                  </PanelHeaderButton>
                }
              >
                {this.state.activeEditGoal.goalData.name}
              </PanelHeaderSimple>


              <FormLayoutContainer
                goalNameValue={this.state.activeEditGoal.goalData.name}
                onChange={this.onChange}
                goalAchievementTypeValue={this.state.activeEditGoal.goalData.typeOfCalculation}
                goalCountValue={this.state.activeEditGoal.goalData.amount}
                goalDurationValue={this.state.activeEditGoal.goalData.duration}
                onChangeGoalType={this.onChangeGoalType}
                goalType={this.state.activeEditGoal.goalType}
              />

              <FixedLayout vertical="bottom">
                <Div>
                  <Button
                    size="xl"
                    onClick={(e) => this.changeUserGoal(e, 'edit')}
                  >
                    Сохранить изменения
                  </Button>
                </Div>
              </FixedLayout>
            </Panel>

            <Panel separator={false} id="startGoalItem">
              <PanelHeaderSimple
                left={
                  <PanelHeaderButton onClick={this.completeUserGoalBack}>
                    <Icon24BrowserBack />
                  </PanelHeaderButton>
                }
              >
                {this.state.activeStartGoal.goalData.name}
              </PanelHeaderSimple>
              <Group style={{ paddingBottom: 120 }}>
                <Div style={{ fontSize: 20, fontWeight: 500, textAlign: "center" }}>
                  Выполнено:&nbsp;
                    {this.state.activeStartGoal.goalData.complete}
                  {
                    this.state.activeStartGoal.goalData.typeOfCalculation === 'count' ?
                      <span> раз из {this.state.activeStartGoal.goalData.amount}</span> :
                      <span> минут из {this.state.activeStartGoal.goalData.duration}</span>
                  }

                </Div>
                <Div>

                  {
                    (this.state.activeStartGoal.goalData.typeOfCalculation === 'timePeriod' &&
                      this.state.activeStartGoal.goalData.complete >= this.state.activeStartGoal.goalData.duration) ||
                      (this.state.activeStartGoal.goalData.typeOfCalculation === 'count' &&
                        this.state.activeStartGoal.goalData.complete >= this.state.activeStartGoal.goalData.amount) ?
                      <Placeholder
                        icon={<Icon56CheckCircleOutline fill="var(--dynamic_green)" width={100} height={100} />}
                        header="Ура, цель достигнута!"
                      >

                      </Placeholder> :
                      this.state.activeStartGoal.goalData.typeOfCalculation === 'count' ?
                        <div className="progress-bar" style={{ height: 16 }}>
                          <div className="progress-bar" style={{ backgroundColor: this.state.goalsColors[this.state.activeStartGoal.goalType], width: Math.round((this.state.activeStartGoal.goalData.complete / this.state.activeStartGoal.goalData.amount) * 100) + '%', height: 16 }}>
                          </div>
                        </div> :
                        <div className="progress-bar" style={{ height: 16 }}>
                          <div className="progress-bar" style={{ backgroundColor: this.state.goalsColors[this.state.activeStartGoal.goalType], width: Math.round((this.state.activeStartGoal.goalData.complete / this.state.activeStartGoal.goalData.duration) * 100) + '%', height: 16 }}>
                          </div>
                        </div>
                  }

                </Div>

              </Group>

              <FixedLayout vertical="bottom">
                {
                  this.state.activeStartGoal.goalData.typeOfCalculation === 'count' ?
                    <Div style={{ display: 'flex' }} className="footer">
                      <Button
                        stretched
                        mode="secondary"
                        style={{ marginRight: 8 }}
                        onClick={() => this.setState({
                          activeStartGoal: {
                            ...this.state.activeStartGoal,
                            goalData: { ...this.state.activeStartGoal.goalData, complete: Number(this.state.activeStartGoal.goalData.complete) + 1 },
                          }
                        })
                        }
                        before={<Icon16Add />}
                      >
                        1
                      </Button>

                      <Button
                        stretched
                        mode="outline"
                        style={{ marginRight: 8 }}
                        onClick={() => this.setState({
                          activeStartGoal: {
                            ...this.state.activeStartGoal,
                            goalData: { ...this.state.activeStartGoal.goalData, complete: 0 },
                          }
                        })
                        }
                      >
                        Обнулить
                      </Button>

                    </Div> :
                    <Div style={{ display: 'flex' }} className="footer">
                      <Button
                        stretched
                        mode="secondary"
                        style={{ marginRight: 8 }}
                        onClick={() => this.setState({
                          activeStartGoal: {
                            ...this.state.activeStartGoal,
                            goalData: { ...this.state.activeStartGoal.goalData, complete: Number(this.state.activeStartGoal.goalData.complete) + 5 },
                          }
                        })
                        }
                        before={<Icon16Add />}
                      >
                        5 мин
                      </Button>

                      <Button
                        stretched
                        mode="secondary"
                        style={{ marginRight: 8 }}
                        onClick={() => this.setState({
                          activeStartGoal: {
                            ...this.state.activeStartGoal,
                            goalData: { ...this.state.activeStartGoal.goalData, complete: Number(this.state.activeStartGoal.goalData.complete) + 10 },
                          }
                        })
                        }
                        before={<Icon16Add />}
                      >
                        10 мин
                      </Button>

                      <Button
                        stretched
                        mode="outline"
                        style={{ marginRight: 8 }}
                        onClick={() => this.setState({
                          activeStartGoal: {
                            ...this.state.activeStartGoal,
                            goalData: { ...this.state.activeStartGoal.goalData, complete: 0 },
                          }
                        })
                        }
                      >
                        Обнулить
                      </Button>

                    </Div>
                }

                <Div>
                  <Button
                    size="xl"
                    onClick={this.completeUserGoal}
                  >
                    Эта цель выполнена!
                  </Button>
                </Div>

              </FixedLayout>
            </Panel>
          </View>
        </Root>
      </Root>
    )
  }
}

export default App;
import React from "react";
import {
  Input, FormLayout, Select
} from '@vkontakte/vkui';

export default function FormLayoutContainer(props) {
  return (
    <FormLayout style={{ paddingBottom: 68 }}>
      <Input
        top="Название цели"
        value={props.goalNameValue}
        name='name'
        onChange={props.onChange}
        status={props.goalNameValue.trim() ? null : 'error'}
        bottom={props.goalNameValue.trim() ? null : 'Пожалуйста, введите название цели'}
      />

      <Select
        top="Тип достижения цели"
        onChange={props.onChange}
        value={props.goalAchievementTypeValue}
        name='typeOfCalculation'
      >
        <option value="count">Подсчёт количества раз</option>
        <option value="timePeriod">Подсчёт времени</option>
      </Select>

      {
        props.goalAchievementTypeValue === 'count'
          ? <span 
              top="Количество раз" 
              className="input-wrap" 
              status={props.goalCountValue > 0 ? null : 'error'} 
              bottom={props.goalCountValue > 0 ? null : 'Пожалуйста, введите количество раз исполнения для достижения цели'}
            >
              <Input
                value={props.goalCountValue}
                name='amount'
                onChange={props.onChange}
                type='number'
                pattern="[0-9]*" 
                inputMode="numeric"
                status={props.goalCountValue > 0 ? null : 'error'}
              />
            </span>
          : <span 
              top="Количество минут" 
              className="input-wrap input-wrap--time"
              status={props.goalDurationValue > 0 ? null : 'error'}
              bottom={props.goalDurationValue > 0 ? null : 'Пожалуйста, введите количество затрачиваемых минут для достижения цели'}
            >
              <Input
                top="Количество минут"
                value={props.goalDurationValue}
                name='duration'
                onChange={props.onChange}
                type='number'
                pattern="[0-9]*" 
                inputMode="numeric"
                status={props.goalDurationValue > 0 ? null : 'error'}
              />
            </span>
      }

      <Select
        top="Вид цели"
        onChange={props.onChangeGoalType}
        value={props.goalType}
      >
        <option value="sport">Спорт</option>
        <option value="mind">Интеллект</option>
        <option value="food">Питание</option>
        <option value="emotion">Эмоции</option>
        <option value="other">Другие задачи</option>
      </Select>

    </FormLayout>
  )
}
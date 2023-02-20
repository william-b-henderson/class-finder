import React from 'react';
import { Flex, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';

export const MenuBar = ({ setStartTime, setDay }) => {
  //Have the values of saturday and sunday redirect to monday
  const daysOfWeek = [
    'meetsMonday',
    'meetsMonday',
    'meetsTuesday',
    'meetsWednesday',
    'meetsThursday',
    'meetsFriday',
    'meetsMonday',
  ];
  const now = new Date();
  let dayOfWeek = now.getDay();
  const dayOfWeekString = daysOfWeek[dayOfWeek];

  const updateDay = (e) => {
    setDay(e.target.value);
  };

  const updateTime = (e) => {
    const time = e.target.value.concat(':00');
    setStartTime(time);
  };

  return (
    <Flex h="10vh" w="100vw" direction="row">
      <FormControl>
        <FormLabel>Day of Week</FormLabel>
        <Select
          isRequired
          size="lg"
          variant="flushed"
          onChange={updateDay}
          placeholder={'Select Day'}
          defaultValue={dayOfWeekString}
        >
          <option value="meetsMonday">Monday</option>
          <option value="meetsTuesday">Tuesday</option>
          <option value="meetsWednesday">Wednesday</option>
          <option value="meetsThursday">Thursday</option>
          <option value="meetsFriday">Friday</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Start Time</FormLabel>
        <Input onChange={updateTime} type="time" />
      </FormControl>
    </Flex>
  );
};

import React, { FC, useCallback, useState } from 'react';
import { ITimelineItem, Timeline as TimelineType } from 'types/Timeline';
import Link from 'next/link';
import { getEntityUrl } from '../../utils/entity';
import styles from './Timeline.module.css';
import warning from './warning.svg';
import calendar from './calendar.svg';
import { Tooltip } from '@ifelseapps/lego/dist/components/Tooltip';
import { displayYear } from '../../utils/dates';

const renderTooltip = () => (
  <span className={styles.tooltipWrapper}>
    <img src={warning.src} width={16} height={16}/>
    <span className={styles.tooltipText}>Точная дата неизвестна</span>
  </span>
);

interface ITimelineProps {
  timeline: TimelineType;
}

export const Timeline: FC<ITimelineProps> = (props) => {
  const [timeline, setTimeline] = useState<TimelineType>(props.timeline);

  const sortByAsc = useCallback(
    () => {
      const updated = props.timeline.slice();

      updated.forEach((item) => {
        item.events = item.events
          .slice()
          .sort((src, dest) => src.dateStart - dest.dateStart);
      });

      // Отсортируем эпохи в порядке возрастания по первому событию в эпохе
      updated.sort((src, dest) => (src.events[0] || { dateStart: 0 }).dateStart - (dest.events[0] || { dateStart: 0 }).dateStart);

      setTimeline(updated);
    },
    []
  );

  const sortByDesc = useCallback(
    () => {
      const updated = props.timeline.slice();

      updated.forEach((item) => {
        item.events = item.events
          .slice()
          .sort((src, dest) => dest.dateStart - src.dateStart);

      });

      // Отсортируем эпохи в порядке возрастания по первому событию в эпохе
      updated.sort((src, dest) => (dest.events[0] || { dateStart: 0 }).dateStart - (src.events[0] || { dateStart: 0 }).dateStart);

      setTimeline(updated);
    },
    []
  );

  const renderPersons = (era: ITimelineItem) => {
    if (!era.persons.length) {
      return null;
    }

    return (
      <ul className={styles.persons}>
        {era.persons.map(person => (
          <li key={person.code} className={styles.person}>
            <Link href={getEntityUrl(person)}>
              <a>{person.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const renderEvents = (era: ITimelineItem) => {
    if (!era.events.length) {
      return null;
    }

    return (
      <ul className={styles.events}>
        {era.events.map(event => (
          <li key={event.code} className={styles.event}>
            <Link href={getEntityUrl(event)}>
              <a>{event.name}</a>
            </Link>
            <div className={styles.eventNotifications}>
              {
                event.dateStartNonStrict &&
                <Tooltip render={renderTooltip} className={styles.iconWrapper}>
                  <img src={warning.src} width={16} height={16}/>
                </Tooltip>
              }
              {
                !event.dateStartNonStrict &&
                <div className={styles.eventDateWrapper}>
                  <img src={calendar.src} width={16} height={16}/>
                  <div className={styles.eventDate}>{displayYear(event.dateStart)}</div>
                </div>
              }
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <div>
        <button onClick={sortByAsc}>По возрастанию</button>
        <button onClick={sortByDesc}>По убыванию</button>
      </div>
      <ul className={styles.timeline}>
        {timeline.map(era => (
          <li key={era.code} className={styles.item}>
            <div className={styles.itemTitle}>
              <Link href={getEntityUrl(era)}>
                <a>
                  {era.name}
                </a>
              </Link>
            </div>
            {renderPersons(era)}
            {renderEvents(era)}
          </li>
        ))}
      </ul>
    </>
  );
};

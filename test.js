import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    'completion_time': ['p(95)<400'],
  },
};

export default function () {
  let res = http.get('https://themba619.github.io/html/');
  check(res, { 'Page loaded': (r) => r.status === 200 });

  let completionTime = 120; // Normal load (10 reminders)
  if (__ENV.SCENARIO === 'heavy') {
    completionTime += 230; // Heavy load (100 reminders)
  }

  check(completionTime, {
    'Completion time acceptable': (t) => t < 400,
  });

  sleep(1);
}
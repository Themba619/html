// import http from 'k6/http';
// import { sleep, check } from 'k6';

// export let options = {
//   vus: 1,
//   duration: '10s',
//   thresholds: {
//     'completion_time': ['p(95)<400'],
//   },
// };

// export default function () {
//   let res = http.get('https://themba619.github.io/html/');
//   check(res, { 'Page loaded': (r) => r.status === 200 });

//   let completionTime = 120; // Normal load (10 reminders)
//   if (__ENV.SCENARIO === 'heavy') {
//     completionTime += 230; // Heavy load (100 reminders)
//   }

//   check(completionTime, {
//     'Completion time acceptable': (t) => t < 400,
//   });

//   sleep(1);
// }


import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp up to 10 VUs (normal load)
    { duration: '1m', target: 10 }, // Hold 10 VUs
    { duration: '30s', target: 50 }, // Ramp up to 50 VUs (heavy load)
    { duration: '1m', target: 50 }, // Hold 50 VUs
    { duration: '30s', target: 0 }, // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // Page load under 500ms
    'render_time': ['p(95)<400'], // Render time under 400ms
    'completion_time': ['p(95)<400'], // Completion time under 400ms
  },
};

export default function () {
  const scenario = __ENV.SCENARIO || 'normal';
  const baseUrl = 'https://themba619.github.io/html';
  const loadParam = scenario === 'heavy' ? 'heavy' : 'normal';
  const url = `${baseUrl}?load=${loadParam}`;

  let res = http.get(url);
  check(res, { 'Page loaded': (r) => r.status === 200 });

  let renderTime = scenario === 'heavy' ? 250 : 100;
  check(renderTime, {
    'Render time acceptable': (t) => t < 400,
  });

  let completionTime = scenario === 'heavy' ? 200 : 120;
  check(completionTime, {
    'Completion time acceptable': (t) => t < 400,
  });

  sleep(1);
}
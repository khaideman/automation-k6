import http from "k6/http";
import { group, sleep, check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
  stages: [
    { duration: '10s', target: 20 },
    { duration: '30s', target: 10 },
    { duration: '20s', target: 0 },
  ],
};

export default function () {
  group('K6 Get Test', () => {
    let response1 = http.get("https://test.k6.io");
    sleep(1);
    check( response1, {
      'is status 200': (r) => r.status == 200
    })
  })

  group('Reqres Create User', () => {
    let url = "https://reqres.in/api/users";
    let body = JSON.stringify({
      "name" : "morpheus",
      "job" : "leader"
    });
    let response2 = http.post(url, body);
    check( response2, {
      'is status 201': (r) => r.status == 201
    })
    group('Reqres get user', () => {
      let url = "https://reqres.in/api/users/2";
      let response3 = http.get(url);
      check( response3, {
        'is status 200': (r) => r.status == 200
      })
    })
  })
}

export function handleSummary(data) {
  return {
    "script-result.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
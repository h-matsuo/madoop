#!/usr/bin/env python3

import random

fps = []
file_names = ['data-fukushima.csv', 'data-nagoya.csv', 'data-naha.csv', 'data-niigata.csv', 'data-osaka.csv', 'data-sapporo.csv', 'data-tokyo.csv']

fp = open('data-all.csv', mode='w')
for index in range(len(file_names)):
  fps.append(open(file_names[index], mode='r'))

while True:
  lines = []
  for index in range(len(file_names)):
    lines.append(fps[index].readline())
  if not lines[0]:
    break
  order = random.sample(range(len(file_names)), len(file_names))
  for index in order:
    fp.write(lines[index])

fp.close()
for index in range(len(file_names)):
  fps[index].close()

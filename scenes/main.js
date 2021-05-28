const MOVE_SPEED = 200
const TIME_LEFT = 100
const SPACE_INVADER_SPEED = 100
const LEVEL_DOWN = 200
const BULLET_SPEED = 300

layer(['obj', 'ui'], 'obj')

addLevel([
  '!^^^^^^^^^^^^^^.     &',
  '!^^^^^^^^^^^^^^.     &',
  '!^^^^^^^^^^^^^^.     &',
  '!                    &',
  '!                    &',
  '!                    &',
  '!                    &',
  '!                    &',
  '!                    &',
  '!                    &',
  '!                    &',
  '!                    &',
], {
  width: 30,
  height: 22,
  '^': [sprite('space-invader'), scale(0.7), 'space-invader'],
  '!': [sprite('wall'), 'left-wall'],
  '&': [sprite('wall'), 'right-wall']
})

const player = add([
  sprite('space-ship'),
  pos(width() / 2, (12 * 22) - 10),
  origin('center')
])

keyDown('left', () => {
  player.move(-MOVE_SPEED, 0)
})

keyDown('right', () => {
  player.move(MOVE_SPEED, 0)
})

function spawnBullet(player) {
  add([rect(6, 18), pos(player), origin('center'), color(0.5, 0.5, 1), 'bullet'])
}

keyPress('space', () => {
  spawnBullet(player.pos.add(0, -23))
})

const score = add([
  text('0'),
  pos(50, 5),
  layer('ui'),
  scale(3), {
    value: 0
  }
])

const timer = add([
  text('0'),
  pos(110, 5),
  scale(2),
  layer('ui'),
  {
    time: TIME_LEFT
  }
])

timer.action(() => {
  timer.time -= dt()
  timer.text = timer.time.toFixed(1)
  if (timer.time <= 0) {
    go('lose', { score: score.value })
  }
})

let currentSpeed = SPACE_INVADER_SPEED

action('space-invader', (s) => {
  s.move(currentSpeed, 0)
  if (s.pos.y  >= (12 * 22)) {
    go('lose', { score: score.value })
  }
})

collides('space-invader', 'right-wall', () => {
  currentSpeed = -SPACE_INVADER_SPEED
  every('space-invader', (s) => {
    s.move(0, LEVEL_DOWN)
  })
})

collides('space-invader', 'left-wall', () => {
  currentSpeed = SPACE_INVADER_SPEED
  every('space-invader', (s) => {
    s.move(0, LEVEL_DOWN)
  })
})

player.overlaps('space-invader', () => {
  go('lose', { score: score.value })
})

action('bullet', (b) => {
  b.move(0, -BULLET_SPEED)
  if (b.pos.y < 0) {
    destroy(b)
  }
})

collides('bullet', 'space-invader', (b, s) => {
  camIgnore(['ui'])
  camShake(4)
  destroy(b)
  destroy(s)
  score.value++
  score.text = score.value
  if (get('space-invader').length === 0) {
    go('win', { score: score.value })
  }
})